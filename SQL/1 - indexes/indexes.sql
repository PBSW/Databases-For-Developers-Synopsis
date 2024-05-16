-- Index for GroceryLists table
CREATE INDEX IX_GroceryLists_OwnerId ON GroceryLists (OwnerId);

-- Indexes for ListItems table
CREATE INDEX IX_ListItems_ItemGotten ON ListItems (ItemGotten);