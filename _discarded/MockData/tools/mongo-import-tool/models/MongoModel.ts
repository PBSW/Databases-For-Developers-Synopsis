
export interface MongoModel {
    userId: number
    username: string
    firstname: string
    lastname: string
    email: string
    hashedPassword: string
    groceryLists: MongoModelList[]
}
export interface MongoModelList {
    listId: number
    ownerId: number
    listName: string
    dateCreated: Date
    products: MongoModelProduct[]
}

export interface MongoModelProduct {
    productId: number
    productName: string
    productGotten: boolean
    quantity: number
    createdAt: Date
    modifiedAt: Date
}
