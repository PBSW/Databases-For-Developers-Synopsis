import * as fs from "fs";
import path from "path";
export class DataSetCreator {
    products = [];
    users = [];
    groceryLists = [];
    currentListId = 0;
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
            const currentUser = this.users[i];
            const groceryLists = this._generateRandomLists(currentUser);
            const entry = {
                UserId: currentUser.UserId,
                Email: currentUser.Email,
                Firstname: currentUser.Firstname,
                Lastname: currentUser.Lastname,
                Username: currentUser.Username,
                HashedPassword: currentUser.HashedPassword,
                GroceryLists: groceryLists
            };
            list.push(entry);
        }
        this.writeToFile(JSON.stringify(list, null, 2)); // Use null and 2 for pretty formatting);
    }
    writeToFile(data) {
        const filePath = 'output/DATA.json'; // Specify the path to the JSON file
        const directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true }); // Create the directory recursively
        }
        // Write the JSON string to the file
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
            }
            else {
                console.log('JSON file has been written successfully!');
            }
        });
    }
    _generateRandomLists(user) {
        let lists = [];
        const count = this.getRandomNumber(1, 5);
        const from = "2024-05-01T00:00:00.000Z";
        const to = "2023-05-01T00:00:00.000Z";
        const maxIndex = this.groceryLists.length - 1;
        for (let i = 0; i < count; i++) {
            const date = this.generateRandomDate(from, to);
            const randomListName = this.groceryLists[this.getRandomNumber(0, maxIndex)].ListName;
            const id = this.currentListId;
            const ownerId = user.UserId;
            //Insert some random products. Remember to randomize quantity and itemGotten
            const randomProducts = this._getRandomProducts();
            lists.push({
                ListId: id,
                ListName: randomListName,
                DateCreated: date,
                OwnerId: ownerId,
                Products: randomProducts
            });
            this._incrementListId();
        }
        return lists;
    }
    _getRandomProducts() {
        const count = this.getRandomNumber(3, 12);
        const maxIndex = this.groceryLists.length - 1;
        let products = [];
        for (let i = 0; i < count; i++) {
            const index = this.getRandomNumber(0, maxIndex);
            const item = this.products[index];
            const productComplete = {
                ItemId: item.ItemId,
                ItemName: item.ItemName,
                Quantity: this.getRandomNumber(1, 6),
                ItemGotten: this.getRandomBoolean()
            };
            products.push(productComplete);
        }
        return products;
    }
    generateRandomDate(from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const timeDiff = toDate.getTime() - fromDate.getTime();
        const randomTime = Math.random() * timeDiff;
        const randomDate = new Date(fromDate.getTime() + randomTime);
        return randomDate;
    }
    _incrementListId() {
        this.currentListId = this.currentListId + 1;
    }
    getRandomNumber(min, max) {
        // Generate a random number between 0 (inclusive) and 1 (exclusive)
        const randomNumber = Math.random();
        // Scale the random number to fit within the range [min, max]
        // Formula: Math.floor(Math.random() * (max - min + 1)) + min
        const scaledNumber = Math.floor(randomNumber * (max - min + 1)) + min;
        return scaledNumber;
    }
    getRandomBoolean() {
        // Generate a random number between 0 (inclusive) and 1 (exclusive)
        const randomNumber = Math.random();
        // Convert the random number to a boolean
        // If the random number is less than 0.5, return true, otherwise return false
        return randomNumber < 0.5;
    }
}
