# Databases-For-Developers-Synopsis


### Domain model 
The Domain model is for a simplified grocery list application, which contains a user table, grocery list table, and items table.
There is a one-to-many and a many-to-many relationship present, with the former being between the user table and the list table, and the latter between the list table and items table, so that grocerylist items can be reused. In a realworld application, the item table would be preloaded with common grocery list items which the user could also add to if a given item does not exist.


### Comparison
As part of the problem statement, the tuned and untuned SQL server should be compared to the same queries and dataset in MongoDB. 
Research should be done (as there must be argumentation) for how the dataset in MongoDB should be structured. Whether to use embedding, referencing or both. 

To simplify the creation of an identical MongoDB database, a small Typescript program can be made to retrieve all data data from the SQL server and map it to a domain model, and then write it to MongoDB.

### Running instances
The databases instances should either be run directly on a Windows PC, which should then exculsivly be that specific PC for all tests to isolate variables. Alternativly, they could be run on a Windows VM.


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

# Optimization


