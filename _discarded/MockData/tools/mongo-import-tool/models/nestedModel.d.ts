export interface NestedModel {
    UserId: number;
    Username: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    HashedPassword: string;
    GroceryLists: [
        {
            ListId: number;
            OwnerId: number;
            ListName: string;
            DateCreated: Date;
            Products: [
                {
                    ItemId: number;
                    Quantity: number;
                    ItemGotten: boolean;
                    ItemName: string;
                }
            ];
        }
    ];
}
