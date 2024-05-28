SET STATISTICS PROFILE on
SET STATISTICS IO on
SET STATISTICS TIME on

--DECLARE @Artist AS NVARCHAR(100) = 'No Te Va Gustar' -- middel element in simple select
--DECLARE @Artist AS NVARCHAR(100) = 'Shakira' -- first element in simple select
DECLARE @Artist AS NVARCHAR(100) = 'Low G' -- last element in simple select

SELECT Title, Album, artist, Songs.Id AS Id, Track, streams, ReleaseDate
--SELECT *
FROM Songs
         JOIN dbo.SongArtists SA on Songs.Id = SA.SongId
         JOIN dbo.Artists A on A.id = SA.ArtistId
WHERE
    artist = @Artist
ORDER BY Popularity DESC, Rank DESC
OPTION (RECOMPILE); -- disable execution plan cache

SET STATISTICS PROFILE OFF
SET STATISTICS IO OFF
SET STATISTICS TIME OFF
