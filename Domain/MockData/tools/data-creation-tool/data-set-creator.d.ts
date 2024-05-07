import { GroceryList, Product, User } from "./models/models";
export declare class DataSetCreator {
    products: Product[];
    users: User[];
    groceryLists: GroceryList[];
    constructor(products: Product[], users: User[], groceryLists: GroceryList[]);
    create(): void;
    writeToFile(data: string): void;
}
