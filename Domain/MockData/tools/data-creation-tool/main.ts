import {DataSetCreator} from "./data-set-creator.js";
import {GroceryList, Product, User} from "./models/models.js";
import {JsonImporter} from "./json-importer.js";

const userPath: string =
    'C:\\Users\\rouge\\OneDrive\\Desktop\\nutrition.csv';
const productPath: string =
    'C:\\Users\\rouge\\OneDrive\\Desktop\\nutrition.csv';
const groceryListPath: string =
    'C:\\Users\\rouge\\OneDrive\\Desktop\\nutrition.csv';

const userImporter: JsonImporter<User> = new JsonImporter<User>();
const productImporter: JsonImporter<Product> = new JsonImporter<Product>();
const groceryListImporter: JsonImporter<GroceryList> = new JsonImporter<GroceryList>();


const users: User[] = await userImporter.getJSONData(userPath);
const products: Product[] = await productImporter.getJSONData(productPath);
const groceryLists: GroceryList[] = await groceryListImporter.getJSONData(groceryListPath);


const creator: DataSetCreator = new DataSetCreator(
    products, users, groceryLists
);

creator.create();


