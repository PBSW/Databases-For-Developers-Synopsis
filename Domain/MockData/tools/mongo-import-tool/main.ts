
import {GroceryList, Product, User} from "./models/models.js";
import * as fs from 'fs';
import {NestedModel} from "./models/nestedModel";
import _ from "lodash";
import {MongoClient} from "mongodb";
import {MongoModel} from "./models/MongoModel.js";


// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);


enum Keys {
    DbName = 'DFD_Synopsis',
    Users = 'users',
    GroceryLists = 'groceryLists',
    Products = 'products',
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

        /**
         *  Consider converting id to ObjectId
         *  const intId = 12345; // Example integer ID
         *  const objectId = new ObjectId(intId);
         */

        //Fix errors in data
        data = mapGroceryListDate(data);
        data = removeDuplicateProductsFromList(data);
        const mappedData = await mapMongoModel(data);

        const productsOnly = await getProducts(mappedData);

        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Rebuild database and collections
        await rebuildDB();


        // Select database and collections
        const db = client.db(Keys.DbName);
        const usersCollection = db.collection(Keys.Users);
        const productsCollection = db.collection(Keys.Products);

        await usersCollection.insertMany(mappedData);
        await productsCollection.insertMany(productsOnly);


        console.log('Data imported successfully');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }

}

// Function to create database and collections
async function rebuildDB(): Promise<void> {
    await client.db(Keys.DbName).dropDatabase();

    const db = client.db(Keys.DbName);
    await db.createCollection(Keys.Users);
    //await db.createCollection(Keys.GroceryLists);
    await db.createCollection(Keys.Products);
    console.log('Database and collections created');
}

async function getProducts(data: MongoModel[]): Promise<{ productId: number, productName: string }[]> {
    // copy array
    const copy = _.cloneDeep<MongoModel[]>(data);

    let dbProducts: {productId: number, productName: string}[] = [];

    // map products
    for (const user of copy) {
        for (const groceryList of user.groceryLists) {
            for (const product of groceryList.products) {
                dbProducts.push({productId: product.productId, productName: product.productName});
            }
        }
    }

    // remove duplicates

    dbProducts = dbProducts.filter(
        (product, index, self) => self.findIndex(p => p.productId === product.productId) === index);

    return dbProducts;
}


async function mapMongoModel(data: NestedModel[]): Promise<MongoModel[]> {
    const copy = _.cloneDeep<NestedModel[]>(data);

    const mongoModels: MongoModel[] = [];

for (const user of copy) {
        const groceryLists = [];

        for (const groceryList of user.GroceryLists) {
            const products = [];

            for (const product of groceryList.Products) {
                products.push({
                    productId: product.ItemId,
                    productName: product.ItemName,
                    productGotten: product.ItemGotten,
                    quantity: product.Quantity
                });
            }

            groceryLists.push({
                listId: groceryList.ListId,
                ownerId: user.UserId,
                listName: groceryList.ListName,
                dateCreated: groceryList.DateCreated,
                products: products
            });
        }

        mongoModels.push({
            userId: user.UserId,
            username: user.Username,
            firstname: user.Firstname,
            lastname: user.Lastname,
            email: user.Email,
            hashedPassword: user.HashedPassword,
            groceryLists: groceryLists
        });
    }

    return mongoModels;
}

function mapGroceryListDate(data: NestedModel[]): NestedModel[] {
    const copy = _.cloneDeep<NestedModel[]>(data);

    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            groceryList.DateCreated = mapToDate(groceryList.DateCreated.toString());
        }
    }

    return copy;
}

function removeDuplicateProductsFromList(data: NestedModel[]): NestedModel[] {
    const copy = _.cloneDeep<NestedModel[]>(data);

    for (const user of copy) {
        for (const groceryList of user.GroceryLists) {
            groceryList.Products = groceryList.Products.filter(
                (product, index, self) => self.findIndex(p => p.ItemId === product.ItemId) === index);
        }
    }

    return copy;
}

function mapToDate(date: string): Date {
    return new Date(date);
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



/* Embedding and referencing
 for (const user of mappedData) {
            const groceryLists = [];

            // Insert grocery lists for user
            for (const groceryList of user.groceryLists) {
                const productIds = [];

                // Insert products for grocery list
                for (const product of groceryList.products) {
                    // Check if product already exists
                    const existingProduct = await productsCollection.findOne({ name: product.productName });
                    if (existingProduct) {
                        productIds.push(existingProduct._id);
                    } else {
                        // Insert product if not exists
                        const insertedProduct = await productsCollection.insertOne(product);
                        productIds.push(insertedProduct.insertedId);
                    }
                }

                // Create grocery list object
                const newGroceryList = {
                    name: groceryList.listName,
                    products: productIds
                };
                groceryLists.push(newGroceryList);
            }

            // Insert user with embedded grocery lists
            await usersCollection.insertOne({
                username: user.username,
                email: user.email,
                groceryLists: groceryLists
            });
        }
 */