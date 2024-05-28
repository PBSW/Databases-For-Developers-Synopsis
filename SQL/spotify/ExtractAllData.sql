
SELECT Songs.Id, Songs.Title, Songs.Album, STRING_AGG(COALESCE(artist, ''), ', ') AS Artists, Songs.Rank, Songs.Date, Songs.Url, Songs.Track, C.chart, T.trend, Songs.streams, Songs.Popularity, Songs.DurationMS, Songs.Explicit, Songs.ReleaseDate, af_danceability, af_energy, af_key, af_loudness, af_mode, af_speechiness, af_acousticness, af_instrumentalness, af_liveness, af_valence, af_tempo, af_time_signature FROM Songs
JOIN dbo.Trends T on T.id = Songs.TrendId
JOIN dbo.SongArtists SA on Songs.Id = SA.SongId
JOIN dbo.Artists on SA.ArtistId = Artists.id
JOIN dbo.Charts C on C.id = Songs.ChartId
JOIN dbo.SongDetails SD on SD.id = Songs.DetailsId
GROUP BY Songs.Id, Songs.Title, Songs.Rank, Songs.Date, Songs.Url, Songs.Track, C.chart, T.trend, Songs.streams, Songs.Album, Songs.Popularity, Songs.DurationMS, Songs.Explicit, Songs.ReleaseDate, af_danceability, af_energy, af_key, af_loudness, af_mode, af_speechiness, af_acousticness, af_instrumentalness, af_liveness, af_valence, af_tempo, af_time_signature