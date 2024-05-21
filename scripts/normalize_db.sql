USE [SpotifyDataset];

DELETE FROM [BaseTable]
where artist LIKE '%??%'

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Artists' AND type = 'U')
BEGIN
    DROP TABLE Artists 
END;

CREATE TABLE Artists (
	id INT PRIMARY KEY IDENTITY(1, 1),
	artist NVARCHAR(128)
);

INSERT INTO Artists
SELECT DISTINCT LTRIM(RTRIM(value)) as artist FROM BaseTable
	CROSS APPLY STRING_SPLIT(artist, ',')


IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Charts' AND type = 'U')
BEGIN
    DROP TABLE Charts 
END;

CREATE TABLE Charts (
	id INT PRIMARY KEY IDENTITY(1, 1),
	chart NVARCHAR(128)
);

INSERT INTO Charts
SELECT DISTINCT chart FROM BaseTable


IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Trends' AND type = 'U')
BEGIN
    DROP TABLE Trends 
END;

CREATE TABLE Trends (
	id INT PRIMARY KEY IDENTITY(1, 1),
	trend NVARCHAR(128)
);

INSERT INTO Trends
SELECT DISTINCT trend FROM BaseTable

UPDATE [SpotifyDataset].[dbo].[BaseTable] SET release_date = CONCAT(release_date, '-01-01')
where len(release_date) = 4 

UPDATE [SpotifyDataset].[dbo].[BaseTable] SET release_date = CONCAT(release_date, '-01')
where len(release_date) = 7 


IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'SongDetails' AND type = 'U')
BEGIN
    DROP TABLE SongDetails 
END;

CREATE TABLE SongDetails (
    id INT PRIMARY KEY IDENTITY(1,1),
    af_danceability DECIMAL,
    af_energy DECIMAL,
    af_key DECIMAL,
    af_loudness DECIMAL,
    af_mode DECIMAL,
    af_speechiness DECIMAL,
    af_acousticness DECIMAL,
    af_instrumentalness DECIMAL,
    af_liveness DECIMAL,
    af_valence DECIMAL,
    af_tempo DECIMAL,
    af_time_signature DECIMAL
);


IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Songs' AND type = 'U')
BEGIN
    DROP TABLE Songs
END;

CREATE TABLE Songs (
    Id INT PRIMARY KEY IDENTITY(1, 1),
    Title NVARCHAR(512),
    [Rank] INT,
    [Date] DATE,
    [Url] NVARCHAR(255),
    ChartId INT,
    TrendId INT,
    streams BIGINT,
    Track NVARCHAR(128),
    Album NVARCHAR(512),
    Popularity INT,
    DurationMS DECIMAL,
    [Explicit] BIT,
    ReleaseDate DATE,
    DetailsId INT,
);

ALTER TABLE Songs
ADD CONSTRAINT fk_ChartId_Charts FOREIGN KEY (ChartId) REFERENCES [SpotifyDataset].[dbo].[Charts] (id)
ALTER TABLE Songs
ADD CONSTRAINT fk_TrendId_Trends FOREIGN KEY (TrendId) REFERENCES Trends(id) 
ALTER TABLE Songs
ADD CONSTRAINT fk_DetailsId_SongDetails FOREIGN KEY (DetailsId) REFERENCES SongDetails (id) ON DELETE CASCADE

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'SongArtists' AND type = 'U')
BEGIN
    DROP TABLE SongArtists
END;

CREATE TABLE SongArtists (
	Id INT PRIMARY KEY IDENTITY(1, 1),
	SongId INT NOT NULL,
	ArtistId INT NOT NULL,
);

ALTER TABLE SongArtists
ADD CONSTRAINT fk_SongArtists_SongId_Artists FOREIGN KEY (ArtistId) REFERENCES [SpotifyDataset].[dbo].Artists (id)
ALTER TABLE SongArtists
ADD CONSTRAINT fk_SongArtists_ArtistId_Songs FOREIGN KEY (SongId) REFERENCES [SpotifyDataset].[dbo].Songs (id) ON DELETE CASCADE

ALTER TABLE Songs
ADD SourceID INT
GO
ALTER TABLE SongDetails
ADD SourceID INT
GO

INSERT INTO SongDetails
	SELECT
		tbl.af_danceability AS af_danceability,
		tbl.af_energy AS af_energy,
		tbl.af_key AS af_key,
		tbl.af_loudness AS af_loudness,
		tbl.af_mode AS af_mode,
		tbl.af_speechiness AS af_speechiness,
		tbl.af_acousticness AS af_acousticness,
		tbl.af_instrumentalness AS af_instrumentalness,
		tbl.af_liveness AS af_liveness,
		tbl.af_valence AS af_valence,
		tbl.af_tempo AS af_tempo,
		tbl.af_time_signature AS af_time_signature,
		tbl.id AS SourceID -- keep original reference for updating other tables
	FROM BaseTable AS tbl

SET DATEFORMAT ymd;
INSERT INTO Songs
	SELECT
		tbl.title AS Title, 
		tbl.[rank] as [Rank], 
		TRY_CONVERT(DATE, tbl.[date]) AS [Date], -- NULLS are fine if source date is invalid format (UNKNOWN)
		tbl.[url] AS [Url],
		(SELECT TOP(1) id FROM Charts AS tmp_chart WHERE tmp_chart.chart = tbl.chart) as ChartId,
		(SELECT TOP(1) id FROM Trends AS tmp_trend WHERE tmp_trend.trend = tbl.trend) as TrendId,
		tbl.streams AS streams,
		tbl.track_id AS Track,
		tbl.album AS Album,
		tbl.popularity AS Popularity,
		tbl.duration_ms AS DurationMS,
		CAST(CASE WHEN tbl.[explicit] = 'True' THEN 1 ELSE 0 END AS BIT) AS [Explicit],
		TRY_CONVERT(DATE, tbl.release_date) AS ReleaseDate, -- NULLS are fine if source date is invalid format (UNKNOWN)
		(SELECT TOP(1) id FROM SongDetails AS tmp_details WHERE tmp_details.SourceId = tbl.id) as DetailsId,
		tbl.id as SourceID -- keep original reference for updating other tables
	FROM BaseTable AS tbl

UPDATE Songs
SET streams = 0
WHERE streams IS NULL

UPDATE Songs
SET Popularity = 0
WHERE Popularity IS NULL

UPDATE Songs
SET Popularity = RESULT.POP, streams = RESULT.STREAMS, Rank = RESULT.RANK
FROM (
	SELECT MIN([INNER].Id) AS ID, AVG (rank) AS RANK, SUM(streams) AS STREAMS, [INNER].track AS TRACK, AVG(popularity) AS POP
	FROM (SELECT Id, Track FROM Songs WHERE Id IN (SELECT MIN (Id) FROM Songs GROUP BY Track)) AS [INNER]
	LEFT OUTER JOIN Songs ON [INNER].Track = Songs.Track
	GROUP BY [INNER].track
) AS RESULT
WHERE Songs.Id = RESULT.ID
GO

DELETE FROM Songs
WHERE NOT Id IN
(SELECT ID FROM (
		SELECT MIN([INNER].Id) AS ID, AVG (rank) AS RANK, SUM(streams) AS STREAMS, [INNER].track AS TRACK, AVG(popularity) AS POP
		FROM (SELECT Id, Track FROM Songs WHERE Id IN (SELECT MIN (Id) FROM Songs GROUP BY Track)) AS [INNER]
		LEFT OUTER JOIN Songs ON [INNER].Track = Songs.Track
		GROUP BY [INNER].track
	) AS [RESULT]
)

INSERT INTO SongArtists
SELECT SongId, ArtistId FROM (
	SELECT BaseId, artist_list, value, Songs.Id as SongId, Artists.id AS ArtistId  FROM (
		SELECT Base.id AS BaseId, Base.artist AS artist_list
		FROM BaseTable AS Base
	) AS [ROOT]
	CROSS APPLY STRING_SPLIT(artist_list, ',')
	FULL JOIN Songs ON Songs.SourceID = BaseId
	FULL JOIN Artists ON Artists.artist = LTRIM(RTRIM(value))
) AS [MASTER]

ALTER TABLE Songs
DROP COLUMN SourceID 
GO
ALTER TABLE SongDetails
DROP COLUMN SourceID
GO