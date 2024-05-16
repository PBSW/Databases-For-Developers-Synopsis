-- Table partition for date. For listItems use lastModified


-- Create a partition function to partition by date
CREATE PARTITION FUNCTION pf_GroceryLists_Date (DATETIME)
AS RANGE LEFT FOR VALUES ('2022-01-01', '2023-01-01', '2024-01-01');

-- Create a partition scheme to associate the function with filegroups
CREATE PARTITION SCHEME ps_GroceryLists_Date
AS PARTITION pf_GroceryLists_Date
TO ([PRIMARY], [ARCHIVE], [OLD_DATA], [FUTURE_DATA]);

-- Apply partitioning to the table
CREATE TABLE GroceryLists (
    ListId INT,
    ListName VARCHAR(60) NOT NULL,
    DateCreated DATETIME NOT NULL,
    OwnerId INT NOT NULL,
    PRIMARY KEY (ListId, DateCreated)
) ON ps_GroceryLists_Date(DateCreated);


-- Apply partitioning to the table
CREATE TABLE ListItems (
    ListId INT,
    ProductId INT,
    Quantity INT NOT NULL,
    ItemGotten BIT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL,
    PRIMARY KEY (ListId, ProductId, CreatedAt)
) ON ps_GroceryLists_Date(CreatedAt);
