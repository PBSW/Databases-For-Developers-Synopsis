
sql_create_db = """
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SpotifyDataset')
BEGIN
  CREATE DATABASE SpotifyDataset;
END
"""

sql_create_base_table = """
USE [SpotifyDataset];

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'BaseTable' AND type = 'U')
BEGIN
    DROP TABLE BaseTable 
END;

CREATE TABLE BaseTable (
    id INT PRIMARY KEY,
    title NVARCHAR(MAX),
    rank INT,
    date NVARCHAR(MAX),
    artist NVARCHAR(MAX),
    url NVARCHAR(MAX),
    region NVARCHAR(MAX),
    chart NVARCHAR(MAX),
    trend NVARCHAR(MAX),
    streams DECIMAL,
    track_id NVARCHAR(MAX),
    album NVARCHAR(MAX),
    popularity DECIMAL,
    duration_ms DECIMAL,
    explicit NVARCHAR(MAX),
    release_date NVARCHAR(MAX),
    available_markets NVARCHAR(MAX),
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
"""

sql0_delete_non_unicode_entries = """
DELETE FROM [SpotifyDataset].[dbo].[BaseTable]
where artist LIKE '%??%'
"""

sql1_create_region_table = """
USE [SpotifyDataset];

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Regions' AND type = 'U')
BEGIN
    DROP TABLE Regions 
END;

CREATE TABLE Regions (
	id INT PRIMARY KEY IDENTITY(1, 1),
	region NVARCHAR(128)
);

INSERT INTO Regions
SELECT DISTINCT region FROM BaseTable
"""

sql2_create_artist_table = """
USE [SpotifyDataset];

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Artists' AND type = 'U')
BEGIN
    DROP TABLE Artists 
END;

CREATE TABLE Artists (
	id INT PRIMARY KEY IDENTITY(1, 1),
	artist NVARCHAR(128)
);

INSERT INTO Artists
SELECT DISTINCT FirstName from (
	SELECT SUBSTRING(artist + ',', 1, CHARINDEX(',', artist)-1) AS FirstName
	FROM [SpotifyDataset].[dbo].[BaseTable]
	WHERE artist LIKE '%,%'
	UNION ALL
	SELECT artist AS FirstName
	FROM [SpotifyDataset].[dbo].[BaseTable]
	WHERE artist NOT LIKE '%,%'
) as artist
"""

sql3_create_charts_table = """
USE [SpotifyDataset];

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
"""

sql4_create_trends_table = """
USE [SpotifyDataset];

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
"""

sql5_update_release_date_to_conform_to_DATE = """
USE [SpotifyDataset];

UPDATE [SpotifyDataset].[dbo].[BaseTable] SET release_date = CONCAT(release_date, '-01-01')
where len(release_date) = 4 

UPDATE [SpotifyDataset].[dbo].[BaseTable] SET release_date = CONCAT(release_date, '-01')
where len(release_date) = 7 
"""

sql__create_song_details_table = """
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'SongDetails' AND type = 'U')
BEGIN
    DROP TABLE SongDetails 
END;

CREATE TABLE SongDetails (
	id INT PRIMARY KEY IDENTITY(1, 1),
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
)
"""

sql_create_available_markets_table = """
USE [SpotifyDataset];

IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AvailableMarkets' AND type = 'U')
BEGIN
    DROP TABLE AvailableMarkets 
END;

CREATE TABLE AvailableMarkets (
	id INT PRIMARY KEY IDENTITY(1, 1),
	market NVARCHAR(2)
);

INSERT INTO AvailableMarkets
SELECT SUBSTRING(distinct_market, 2, len(distinct_market)-2) as market FROM (
	SELECT DISTINCT SUBSTRING(list + ',', 1, CHARINDEX(',', list)-1) AS distinct_market  FROM (
		SELECT SUBSTRING(available_markets, 2, len(available_markets)-2) AS list
		FROM BaseTable
	) AS _TMP0
	WHERE list LIKE '%,%'
) AS _TMP1
"""