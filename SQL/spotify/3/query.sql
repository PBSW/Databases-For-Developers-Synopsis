SET STATISTICS PROFILE on
SET STATISTICS IO on
SET STATISTICS TIME on

-- get popular songs (order by popularity, streams, ReleaseDate) where Trend is not MOVE_DOWN

-- pagination
DECLARE @PAGE_NUM AS INT = 0
DECLARE @PAGE_SIZE AS INT = 200

SELECT * FROM Songs
JOIN dbo.SongArtists SA on Songs.Id = SA.SongId
JOIN dbo.Artists A on (A.id) = SA.ArtistId
WHERE NOT TrendId IN (1, 5) -- MOVE_DOWN, NULL
ORDER BY Popularity DESC , streams DESC , ReleaseDate DESC
OFFSET @PAGE_NUM * @PAGE_SIZE ROWS FETCH NEXT @PAGE_SIZE ROWS ONLY
OPTION (RECOMPILE, MAXDOP 1); -- disable execution plan cache and disable parallelism

-- 139151
-- 115491
-- 023660
SET STATISTICS PROFILE OFF
SET STATISTICS IO OFF
SET STATISTICS TIME OFF
