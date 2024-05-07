export interface User {
    UserId: number
    Username: string
    Firstname: string
    Lastname: string
    Email: string
    HashedPassword: string
}

export interface Product {
    ItemId: number
    ItemName: string
}

export interface GroceryList {
    ListId: number
    OwnerId: number
    ListName: string
    DateCreated: Date
}