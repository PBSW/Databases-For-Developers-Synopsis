-- All items a user has on an existing grocery list that they haven't gotten
DECLARE @UserId INT
SET @UserId = 100

SELECT *
FROM ListItems AS LI
INNER JOIN Products AS P ON LI.ProductId = P.ProductId
INNER JOIN GroceryLists AS GL ON LI.ListId = GL.ListId
WHERE GL.OwnerId = @UserId -- Specify the UserId of the user who owns the grocery lists
AND LI.ItemGotten = 0 -- Filter to retrieve items that the user hasn't gotten yet

ORDER BY LI.ModifiedAt DESC;
