CREATE TABLE Users (
    UserId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    Username NVARCHAR(50) NOT NULL,
    Firstname NVARCHAR(50) NOT NULL,
    Lastname NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    HashedPassword CHAR(128) NOT NULL
)



-- User has zero-to-many lists
CREATE TABLE GroceryLists (
    ListId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    ListName VARCHAR(60) NOT NULL,
    DateCreated DATETIME NOT NULL,
    OwnerId INT NOT NULL
)


CREATE TABLE Products (
    ProductId INT PRIMARY KEY, --Need to manually add ID in Dataset. No IDENTITY(1,1)
    ProductName VARCHAR(100) NOT NULL,
)


-- Many-to-many => Many lists can have many grocery items
CREATE TABLE ListItems (
    PRIMARY KEY (ListId, ProductId),
    ListId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    ItemGotten BIT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL
)

