export class DataSetCreator {
    products = [];
    users = [];
    groceryLists = [];
    constructor(products, users, groceryLists) {
        this.products = products;
        this.users = users;
        this.groceryLists = groceryLists;
    }
    create() {
        console.log("Creating data set...");
        console.log("Users: ", this.users.length);
        console.log("Products: ", this.products.length);
        console.log("GroceryLists: ", this.groceryLists.length);
        let list = [];
        for (let i = 0; i < this.users.length; i++) {
            //Insert some random lists. Remember to change ownerId to the current user's id
            //Insert some random products. Remember to randomize quantity and itemGotten
        }
        //this.writeToFile(JSON.stringify(list));
    }
    writeToFile(data) {
        //fs.writeFileSync('C:\\Users\\rouge\\OneDrive\\Desktop\\nutrition.csv', data);
    }
}
