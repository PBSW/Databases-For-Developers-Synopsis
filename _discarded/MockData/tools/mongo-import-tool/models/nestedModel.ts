import {GroceryListComplete} from "./models";

export interface NestedModel {
    UserId: number
    Username: string
    Firstname: string
    Lastname: string
    Email: string
    HashedPassword: string
    GroceryLists: GroceryListComplete[]
}