
import {GroceryList, Product, User} from "./models/models.js";
import {JsonImporter} from "./json-importer.js";
import {DataSetCreator} from "./data-set-creator.js";

const userPath: string =
    'dataset/USER_MOCK_DATA.json';
const productPath: string =
    'dataset/PRODUCT_MOCK_DATA.json';
const groceryListPath: string =
    'dataset/LIST_MOCK_DATA.json';



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


