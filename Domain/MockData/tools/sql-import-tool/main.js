import * as fs from 'fs';
import pkg from 'mssql';
import _ from "lodash";
const { Bit, Char, ConnectionPool, DateTime, Int, NVarChar, Transaction } = pkg;
// Configuration for SQL Server connection
const config = {
    user: 'local',
    password: '123456',
    server: 'localhost',
    database: 'DFD_Synopsis',
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // If you're using Azure, set to true
        trustServerCertificate: true // If you're using Azure, set to true
    }
};
async function connectToDatabase() {
    try {
        let dbConn = new ConnectionPool(config); //Config
        //let dbConn = new ConnectionPool('Server=localhost;Database=master;Trusted_Connection=True;'); //ConnString
        return await dbConn.connect();
        //return await sql.connect(config);
    }
    catch (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
}
// Function to read JSON file
async function readJSONFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(data));
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    });
}
// Function to insert data into SQL Server
async function insertData(data) {
    try {
        const pool = await connectToDatabase();
        const dbProducts = mapDbProducts(data);
        console.log(dbProducts.length);
        data = mapGroceryListDate(data);
        data = removeDuplicateProductsFromList(data);
        // Respect foreign keys. Start by adding Users and products. Then lists. Then populate the many-to-many relation.
        //Start transaction
        const transaction = new Transaction(pool);
        await transaction.begin();
        // Insert users
        for (const user of data) {
            await pool.request()
                .input('UserID', Int, user.UserId)
                .input('Username', NVarChar(50), user.Username)
                .input('Firstname', NVarChar(50), user.Firstname)
                .input('Lastname', NVarChar(50), user.Lastname)
                .input('Email', NVarChar(100), user.Email)
                .input('HashedPassword', Char(100), user.HashedPassword)
                .query('INSERT INTO Users (UserId, Username, Firstname, Lastname, Email, HashedPassword) VALUES (@UserId, @Username, @Firstname, @Lastname, @Email, @HashedPassword)');
        }
        // Insert products
        for (const product of dbProducts) {
            await pool.request()
                .input('ProductId', Int, product.ItemId)
                .input('ProductName', NVarChar(100), product.ItemName)
                .query('INSERT INTO Products (ProductId, ProductName) VALUES (@ProductId, @ProductName)');
        }
        //End transaction
        await transaction.commit();
        //Start transaction
        const transaction2 = new Transaction(pool);
        await transaction2.begin();
        // Insert grocery lists
        for (const list of data) {
            for (const groceryList of list.GroceryLists) {
                await pool.request()
                    .input('ListID', Int, groceryList.ListId)
                    .input('ListName', NVarChar(100), groceryList.ListName)
                    .input('DateCreated', DateTime, toSqlDateTime(groceryList.DateCreated))
                    .input('OwnerId', Int, list.UserId)
                    .query('INSERT INTO GroceryLists (ListID, ListName, DateCreated, OwnerId) VALUES (@ListID, @ListName, @DateCreated, @OwnerId)');
            }
        }
        //End transaction
        await transaction2.commit();
        //Start transaction
        const transaction3 = new Transaction(pool);
        await transaction3.begin();
        // ListItems - many-to-many relation
        for (const list of data) {
            for (const groceryList of list.GroceryLists) {
                for (const product of groceryList.Products) {
                    await pool.request()
                        .input('ListId', Int, groceryList.ListId)
                        .input('ProductId', Int, product.ItemId)
                        .input('Quantity', Int, product.Quantity)
                        .input('ItemGotten', Bit, product.ItemGotten ? 1 : 0)
                        .query('INSERT INTO ListItems (ListId, ProductId, Quantity, ItemGotten) VALUES (@ListID, @ProductId, @Quantity, @ItemGotten)');
                }
            }
        }
        //End transaction
        await transaction3.commit();
        console.log('Data inserted successfully.');
        await pool.close();
    }
    catch (err) {
        console.error('Error:', err);
        throw err;
    }
}
function toSqlDateTime(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
function mapGroceryListDate(data) {
    const copy = _.cloneDeep(data);
    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            groceryList.DateCreated = mapToDate(groceryList.DateCreated.toString());
        }
    }
    return copy;
}
function removeDuplicateProductsFromList(data) {
    const copy = _.cloneDeep(data);
    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            groceryList.Products = groceryList.Products.filter((product, index, self) => self.findIndex(p => p.ItemId === product.ItemId) === index);
        }
    }
    return copy;
}
function mapToDate(date) {
    return new Date(date);
}
function mapDbProducts(data) {
    // copy array
    const copy = _.cloneDeep(data);
    let dbProducts = [];
    // map products
    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            for (const product of groceryList.Products) {
                dbProducts.push({ ItemId: product.ItemId, ItemName: product.ItemName });
            }
        }
    }
    // remove duplicates
    dbProducts = dbProducts.filter((product, index, self) => self.findIndex(p => p.ItemId === product.ItemId) === index);
    return dbProducts;
}
// Main function
async function main() {
    try {
        const filename = 'input/DATA.json'; // Path to your JSON file
        const data = await readJSONFile(filename);
        await insertData(data);
    }
    catch (err) {
        console.error('Error:', err);
    }
}
main();
