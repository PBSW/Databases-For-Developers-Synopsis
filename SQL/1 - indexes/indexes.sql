-- Index for the OwnerId column in GroceryLists table
CREATE INDEX IDX_GroceryLists_OwnerId ON GroceryLists (OwnerId);

-- Index for the ProductId column in Products table (if necessary)
CREATE INDEX IDX_Products_ProductId ON Products (ProductId);

-- Index for the ListId column in ListItems table (if necessary)
CREATE INDEX IDX_ListItems_ListId ON ListItems (ListId);

-- Index for the ProductId column in ListItems table (if necessary)
CREATE INDEX IDX_ListItems_ProductId ON ListItems (ProductId);

CREATE INDEX IDX_ListItems_ItemGotten ON ListItems (ItemGotten);