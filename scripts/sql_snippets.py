
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
    title NVARCHAR(255),
    rank INT,
    date NVARCHAR(255),
    artist NVARCHAR(255),
    url NVARCHAR(255),
    region NVARCHAR(1024),
    chart NVARCHAR(255),
    trend NVARCHAR(255),
    streams DECIMAL,
    track_id NVARCHAR(255),
    album NVARCHAR(255),
    popularity DECIMAL,
    duration_ms DECIMAL,
    explicit NVARCHAR(255),
    release_date NVARCHAR(255),
    available_markets NVARCHAR(255),
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

sql_insert_data = """
-- import the file
USE [SpotifyDataset];

BULK INSERT BaseTable
FROM '{0}'
WITH
(
        FORMAT='CSV',
        FIRSTROW=2,
        FIELDTERMINATOR = ',',
        ROWTERMINATOR = '\\n'
)
"""