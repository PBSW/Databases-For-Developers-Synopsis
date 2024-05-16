set statistics time on
set statistics io on

SELECT ProductsTable.ProductId, 
	   ProductsTable.ProductName, 
	   ItemsTable.Quantity, 
	   ItemsTable.ItemGotten, 
	   ItemsTable.CreatedAt, 
	   ItemsTable.ModifiedAt 
FROM dbo.ListItems AS ItemsTable
INNER JOIN dbo.Products AS ProductsTable ON ProductsTable.ProductId = ItemsTable.ProductId
WHERE ItemsTable.ListId = 100
ORDER BY ItemsTable.CreatedAt;

set statistics time off
set statistics io off
