USE [master]
GO

CREATE DATABASE DFD_Synopsis
GO

USE DFD_Synopsis
GO

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    Lastname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    HashedPassword CHAR(128) NOT NULL
)

GO

CREATE TABLE GroceryLists (
    ListId INT IDENTITY(1,1) PRIMARY KEY,
    ListName VARCHAR(60) NOT NULL,
    DateCreated DATETIME NOT NULL
)

GO

-- Many-to-many relationship junction table
CREATE TABLE Users_Lists (
    PRIMARY KEY (UserId, ListId),
    UserId INT NOT NULL,
    ListId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ListId) REFERENCES GroceryLists(ListId)
)

GO

-- One-to-many
CREATE TABLE ListItems (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName VARCHAR(60) NOT NULL,
    ItemGotten BIT NOT NULL,
    ListId INT NOT NULL,
    FOREIGN KEY (ListId) REFERENCES GroceryLists(ListId)
)

GO


INSERT INTO Users (Username, FirstName, Lastname, Email, HashedPassword) 
VALUES 
('user1', 'John', 'Doe', 'john.doe@example.com', 'hashed_password_1'),
('user2', 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_2'),
('user3', 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_3');

INSERT INTO GroceryLists (ListName, DateCreated) 
VALUES 
('Weekly Grocery', '2024-05-01 10:00:00'),
('Monthly Shopping', '2024-04-15 08:30:00');

INSERT INTO Users_Lists (UserId, ListId) 
VALUES 
(1, 1),
(2, 1),
(2, 2),
(3, 2);

INSERT INTO ListItems (ItemName, ItemGotten, ListId) 
VALUES 
('Apples', 0, 1),
('Milk', 1, 1),
('Bread', 0, 1),
('Eggs', 1, 1),
('Toilet Paper', 0, 2),
('Laundry Detergent', 1, 2),
('Shampoo', 0, 2),
('Dish Soap', 1, 2);