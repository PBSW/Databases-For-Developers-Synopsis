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


export interface ProductComplete {
    ItemId: number
    ItemName: string
    ItemGotten: boolean
    Quantity: number
    CreatedAt: Date
    ModifiedAt: Date
}

export interface GroceryList {
    ListId: number
    ListName: string
    DateCreated: Date
}

export interface GroceryListComplete {
    ListId: number
    OwnerId: number
    ListName: string
    DateCreated: Date
    Products: ProductComplete[]
}