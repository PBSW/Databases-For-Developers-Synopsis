SET STATISTICS PROFILE on
SET STATISTICS IO on
SET STATISTICS TIME on

DECLARE @search AS NVARCHAR(100) = 'Boule'

--SELECT Title, Album, artist, Songs.Id AS Id, Track, streams, ReleaseDate
SELECT  *
FROM Songs
WHERE
    Title LIKE @search + '%'
    OR
    Album LIKE @search + '%'
ORDER BY Popularity DESC, Rank DESC
OPTION (RECOMPILE, MAXDOP 1); -- disable execution plan cache and disable parallelism

SET STATISTICS PROFILE OFF
SET STATISTICS IO OFF
SET STATISTICS TIME OFF
