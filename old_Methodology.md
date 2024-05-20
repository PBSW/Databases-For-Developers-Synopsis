# Databases-For-Developers-Synopsis


### Domain model 
The Domain model is for a simplified grocery list application, which contains a user table, grocery list table, and items table.
There is a one-to-many and a many-to-many relationship present, with the former being between the user table and the list table, and the latter between the list table and items table, so that grocerylist items can be reused. In a realworld application, the item table would be preloaded with common grocery list items which the user could also add to if a given item does not exist.


### Comparison
As part of the problem statement, the tuned and untuned SQL server should be compared to the same queries and dataset in MongoDB. 
Research should be done (as there must be argumentation) for how the dataset in MongoDB should be structured. Whether to use embedding, referencing or both. 

To simplify the creation of an identical MongoDB database, a small Typescript program can be made to retrieve all data data from the SQL server and map it to a domain model, and then write it to MongoDB.

### Running instances
Docker

### Monitoring
Monitoring for SQL server should be done with Windows Performance Monitor, which contains specfiic tools to monitor SQL Server.
MongoDB has it's own monitoring tools, but __mongo-top__ and __mongo-stat__  could also be used.
This will not be an apples-to-apples comparison, but there simply is not a benchmarking tool to measure performance between two very different databases, without accidentially testing the database driver in e.g. a DotNet solution. 

## Test cases
Test cases for queries that could be used in a real world application

### Retrieve all lists for a given user
- Test one-to-many retrieval.

### Retrieve an entire list with all it's items.
- Test many-to-many retrieval.

### All items a user has on an existing grocery list that they haven't gotten
.

.

.

# Optimizations

## Indexing
The primary keys are automatically indexed. Based on the test cases designed the ideal additional indexes that make sense would be to index both OwnerId from the GroceryList table and ItemGotten from the ListItems table. These are specifically queried, and while OwnerId is a foreign key to the Users.UserId field, Test case 2 does not have a JOIN for the Users table.
If one of the test cases was searching for a product in the Products table (which is very likely as the schema is designed to share a dataset of products among users), indexing the ProductName would have been ideal.
Likewise, indexing the Username for the Users table would have been ideal if a test case had included fetching login credentials.

