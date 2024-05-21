
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
