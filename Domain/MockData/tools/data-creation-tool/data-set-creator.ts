import {GroceryList, Product, User} from "./models/models";
import {NestedModel} from "./models/nestedModel";

export class DataSetCreator {

    products: Product[] = [];
    users: User[] = [];
    groceryLists: GroceryList[] = [];

    constructor(
        products: Product[],
        users: User[],
        groceryLists: GroceryList[]
    ) {
        this.products = products;
        this.users = users;
        this.groceryLists = groceryLists;
    }




    create() {
        console.log("Creating data set...");
        console.log("Users: ", this.users.length);
        console.log("Products: ", this.products.length);
        console.log("GroceryLists: ", this.groceryLists.length);

        let list: NestedModel[] = [];

        for (let i = 0; i < this.users.length; i++) {

            //Insert some random lists. Remember to change ownerId to the current user's id

            //Insert some random products. Remember to randomize quantity and itemGotten
        }

        //this.writeToFile(JSON.stringify(list));
    }


    writeToFile(data: string) {
        //fs.writeFileSync('C:\\Users\\rouge\\OneDrive\\Desktop\\nutrition.csv', data);

    }
}