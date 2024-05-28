ALTER TABLE GroceryLists
ADD CONSTRAINT FK_GroceryLists_OwnerId FOREIGN KEY (OwnerId) REFERENCES Users(UserId);

-- Add foreign key for ListId in ListItems table
ALTER TABLE ListItems
ADD CONSTRAINT FK_ListItems_ListId FOREIGN KEY (ListId) REFERENCES GroceryLists(ListId);

-- Add foreign key for ProductId in ListItems table
ALTER TABLE ListItems
ADD CONSTRAINT FK_ListItems_ProductId FOREIGN KEY (ProductId) REFERENCES Products(ProductId);