

-- when searching for songs by an artist
DROP INDEX IF EXISTS IX_Artists_artist ON Artists
CREATE INDEX IX_Artists_artist ON Artists (artist)
GO

DROP INDEX IF EXISTS IX_SongArtists_ArtistId ON SongArtists
CREATE INDEX IX_SongArtists_ArtistId ON SongArtists (ArtistId)
GO

-- When searching for an album/song
DROP INDEX IF EXISTS IX_Songs_Title ON Songs
CREATE INDEX IX_Songs_Title ON Songs (Title)
GO

DROP INDEX IF EXISTS IX_Songs_Album ON Songs
CREATE INDEX IX_Songs_Album ON Songs (Album)
GO

