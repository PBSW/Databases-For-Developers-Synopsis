
import {GroceryList, Product, User} from "./models/models.js";
import * as fs from 'fs';
//import * as sql from 'mssql';
import * as _ from 'lodash';
import {NestedModel} from "./models/nestedModel";
import pkg from 'mssql';
const { Bit, Char, ConnectionPool, DateTime, Int, NVarChar, Transaction } = pkg;


// Configuration for SQL Server connection
const config: pkg.config = {
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

async function connectToDatabase(): Promise<pkg.ConnectionPool> {
    try {
        let dbConn = new ConnectionPool(config); //Config
        //let dbConn = new ConnectionPool('Server=localhost;Database=master;Trusted_Connection=True;'); //ConnString
        return await dbConn.connect();

        //return await sql.connect(config);
    } catch (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
}


// Function to read JSON file
async function readJSONFile(filename: string): Promise<NestedModel[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(data) as NestedModel[]);
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

// Function to insert data into SQL Server
async function insertData(data: NestedModel[]): Promise<void> {
    try {
        const pool = await connectToDatabase();


        const dbProducts: {ItemId: number, ItemName: string}[] = mapDbProducts(data)


        // Respect foreign keys. Start by adding Users and products. Then lists. Then populate the many-to-many relation.

        //Start transaction
        const transaction = new Transaction(pool);

        // Insert users
        for (const user of data) {
            await pool.request()
                .input('UserID', Int, user.UserId)
                .input('Username', NVarChar(50), user.Username)
                .input('Firstname', NVarChar(50), user.Firstname)
                .input('Lastname', NVarChar(50), user.Lastname)
                .input('Email', NVarChar(100), user.Email)
                .input('HashedPassword', Char(100), user.HashedPassword)
                .query(
                    'INSERT INTO Users (UserId, Username, Firstname, Lastname, Email, HashedPassword) VALUES (@UserId, @Username, @Firstname, @Lastname, @Email, @HashedPassword)'
                );

        }

        // Insert products
        for (const product of dbProducts) {
            await pool.request()
                .input('ProductId', Int, product.ItemId)
                .input('ProductName', NVarChar(100), product.ItemName)
                .query('INSERT INTO Products (ItemId, ItemName) VALUES (@ItemId, @ItemName)');
        }

        //End transaction
        await transaction.commit();


        //Start transaction
        const transaction2 = new Transaction(pool);
        // Insert grocery lists
        for (const list of data) {

            for (const groceryList of list.GroceryLists) {
                await pool.request()
                    .input('ListID', Int, groceryList.ListId)
                    .input('ListName', NVarChar(100), groceryList.ListName)
                    .input('DateCreated', DateTime, groceryList.DateCreated.toISOString().slice(0, 19).replace('T', ' '))
                    .input('OwnerId', Int, list.UserId)
                    .query('INSERT INTO GroceryLists (ListID, ListName, DateCreated, OwnerId) VALUES (@ListID, @ListName, @DateCreated, @OwnerId)');
            }
        }
        //End transaction
        await transaction2.commit();

        //Start transaction
        const transaction3 = new Transaction(pool);

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
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


function mapDbProducts(data: NestedModel[]): {ItemId: number, ItemName: string}[] {
    // copy array
    const copy = _.cloneDeep<NestedModel[]>(data);

    let dbProducts: {ItemId: number, ItemName: string}[] = [];

    // map products
    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            for (const product of groceryList.Products) {
                dbProducts.push({ItemId: product.ItemId, ItemName: product.ItemName});
            }
        }
    }

    return dbProducts;
}

// Main function
async function main() {
    try {
        const filename = 'input/DATA.json'; // Path to your JSON file
        const data: NestedModel[] = await readJSONFile(filename);
        await insertData(data);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();



