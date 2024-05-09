USE [master]
GO

IF EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'DFD_Synopsis')
BEGIN
    DROP DATABASE DFD_Synopsis;
END

CREATE DATABASE DFD_Synopsis
GO

USE DFD_Synopsis
GO

CREATE TABLE Users (
    UserId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    Username NVARCHAR(50) NOT NULL,
    Firstname NVARCHAR(50) NOT NULL,
    Lastname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    HashedPassword CHAR(128) NOT NULL
)

GO

-- User has zero-to-many lists
CREATE TABLE GroceryLists (
    ListId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    ListName VARCHAR(60) NOT NULL,
    DateCreated DATETIME NOT NULL,
    OwnerId INT NOT NULL,
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
)


CREATE TABLE Products (
    ProductId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    ProductName VARCHAR(100) NOT NULL,
)

GO


-- Many-to-many => Many lists can have many grocery items
CREATE TABLE ListItems (
    PRIMARY KEY (ListId, ProductId),
    ListId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    ItemGotten BIT NOT NULL,
    FOREIGN KEY (ListId) REFERENCES GroceryLists(ListId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)
GO


