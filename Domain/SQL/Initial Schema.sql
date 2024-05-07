USE [master]
GO

CREATE DATABASE DFD_Synopsis
GO

USE DFD_Synopsis
GO

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Firstname NVARCHAR(50) NOT NULL,
    Lastname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    HashedPassword CHAR(128) NOT NULL
)

GO

-- User has zero-to-many lists
CREATE TABLE GroceryLists (
    ListId INT IDENTITY(1,1) PRIMARY KEY,
    ListName VARCHAR(60) NOT NULL,
    DateCreated DATETIME NOT NULL,
    OwnerId INT NOT NULL,
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId)
)


CREATE TABLE Products (
    ItemId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName VARCHAR(60) NOT NULL,
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
    FOREIGN KEY (ProductId) REFERENCES Products(ItemId)
)
GO


INSERT INTO Users (Username, Firstname, Lastname, Email, HashedPassword) 
VALUES 
('user1', 'John', 'Doe', 'john.doe@example.com', 'hashed_password_1'),
('user2', 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_2'),
('user3', 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_3');

INSERT INTO Products (ItemName) 
VALUES 
('Apples'), 
('Milk'),
('Bread'), 
('Eggs'),
('Toilet Paper'),
('Laundry Detergent'),
('Shampoo'), 
('Dish Soap');


GO 


INSERT INTO GroceryLists (ListName, DateCreated, OwnerId) 
VALUES 
('Weekly Grocery', '2024-05-01 10:00:00', 1),
('Monthly Shopping', '2024-04-15 08:30:00', 2);
GO

INSERT INTO ListItems (ListId, ProductId, Quantity, ItemGotten) 
VALUES 
(1, 1, 1, 0),
(2, 4, 1, 0),
(2, 2, 1, 0),
(1, 3, 1, 0);

GO