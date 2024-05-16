-- All items a user has on an existing grocery list that they haven't gotten
set statistics time on
set statistics io on
DECLARE @UserId INT
SET @UserId = 100

SELECT LI.*, P.ProductName
FROM ListItems AS LI
INNER JOIN Products AS P ON LI.ProductId = P.ProductId
INNER JOIN GroceryLists AS GL ON LI.ListId = GL.ListId
WHERE GL.OwnerId = @UserId -- Specify the UserId of the user who owns the grocery lists
AND LI.ItemGotten = 0 -- Filter to retrieve items that the user hasn't gotten yet

ORDER BY LI.ModifiedAt DESC;
set statistics time off
set statistics io off
