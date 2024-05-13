SELECT * 
FROM dbo.ListItems AS ItemsTable
JOIN dbo.Products AS ProductsTable ON ProductsTable.ProductId = ItemsTable.ProductId
WHERE ItemsTable.ListId = 100
ORDER BY ItemsTable.CreatedAt;