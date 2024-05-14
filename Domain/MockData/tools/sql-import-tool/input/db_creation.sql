IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'DFD_Synopsis')
BEGIN
    DECLARE @DatabaseName nvarchar(50)
    SET @DatabaseName = N'DFD_Synopsis'

    DECLARE @SQL varchar(max)

    SELECT @SQL = COALESCE(@SQL,'') + 'Kill ' + Convert(varchar, SPId) + ';'
    FROM MASTER..SysProcesses
    WHERE DBId = DB_ID(@DatabaseName) AND SPId <> @@SPId

    --SELECT @SQL
    EXEC(@SQL)

    DROP DATABASE DFD_Synopsis;
END

CREATE DATABASE DFD_Synopsis

