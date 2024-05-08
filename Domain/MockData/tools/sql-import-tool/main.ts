
import {GroceryList, Product, User} from "./models/models.js";
import * as fs from 'fs';
import * as sql from 'mssql';

// Configuration for SQL Server connection
const config: sql.config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
    options: {
        encrypt: true, // If you're using Azure, set to true
        trustServerCertificate: true // If you're using Azure, set to true
    }
};

// Function to read JSON file
async function readJSONFile(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

// Function to insert data into SQL Server
async function insertData(data: any): Promise<void> {
    try {
        const pool = await sql.connect(config);

        // Assuming data structure: { users: [], groceryLists: [], products: [] }
        // Insert users
        for (const user of data.users) {
            await pool.request()
                .input('UserID', sql.Int, user.UserID)
                .input('UserName', sql.NVarChar(100), user.UserName)
                .query('INSERT INTO Users (UserID, UserName) VALUES (@UserID, @UserName)');
        }

        // Insert grocery lists
        for (const list of data.groceryLists) {
            await pool.request()
                .input('ListID', sql.Int, list.ListID)
                .input('UserID', sql.Int, list.UserID)
                .input('ListName', sql.NVarChar(100), list.ListName)
                .query('INSERT INTO GroceryLists (ListID, UserID, ListName) VALUES (@ListID, @UserID, @ListName)');
        }

        // Insert products
        for (const product of data.products) {
            await pool.request()
                .input('ProductID', sql.Int, product.ProductID)
                .input('ProductName', sql.NVarChar(100), product.ProductName)
                .query('INSERT INTO Products (ProductID, ProductName) VALUES (@ProductID, @ProductName)');
        }

        // Additional logic for many-to-many relationships if needed

        console.log('Data inserted successfully.');
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// Main function
async function main() {
    try {
        const filename = 'data.json'; // Path to your JSON file
        const data = await readJSONFile(filename);
        await insertData(data);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();



