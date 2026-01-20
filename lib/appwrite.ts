import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import type {CreateMenuItemParams, CreateOrderParams, CreateUserParams, GetMenuParams, SignInParams, OrderDoc, User} from "@/type";
export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.jsm.foodordering",
    databaseId: '696c313d0034e799b900',
    bucketId: '696d4050003a56512a53',
    userCollectionId: 'user',
    categoriesCollectionId: 'categories',
    menuCollectionId: 'menu',
    customizationsCollectionId: 'customizations',
    menuCustomizationsCollectionId: 'menu_customizations',
    ordersCollectionId: "orders",
    orderItemsCollectionId: "order_items",
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);
const maxImageUrlLength = 100;

const normalizeOrderItemImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";
    if (imageUrl.length <= maxImageUrlLength) return imageUrl;

    const fileIdMatch = imageUrl.match(/\/files\/([^/]+)\//);
    if (fileIdMatch?.[1]) return fileIdMatch[1];

    const withoutQuery = imageUrl.split("?")[0];
    if (withoutQuery.length <= maxImageUrlLength) return withoutQuery;

    return imageUrl.slice(0, maxImageUrlLength);
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument<User>(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {email, name, accountId: newAccount.$id, avatar: avatarUrl}
        );


    } catch (e) {
        throw new Error(e as string);
    }

}
export const signIn = async ({email, password}: SignInParams) => {
    try {
        await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async (): Promise<User> => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments<User>(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        const userDoc = currentUser.documents[0];
        if(!userDoc) throw new Error("User profile not found.");
        return userDoc;
    } catch(e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({category, query } : GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        );
        return menus.documents;
    } catch(e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try{
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch(e) {
        throw new Error(e as string);
    }
}

export const signOut = async () => {
    try {
        await account.deleteSession('current');
    }catch (e) {
        throw new Error(e as string);
    }
};

export const createMenuItem = async ({
    name,
    description,
    image_url,
    price,
    rating,
    calories,
    protein,
    categoryId,
}: CreateMenuItemParams) => {
    try {
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name,
                description,
                image_url,
                price,
                rating,
                calories,
                protein,
                categories: categoryId,
            }
        );
    } catch (e) {
        throw new Error(e as string);
    }
};

export const createOrder = async ({ userId, items, total }: CreateOrderParams) => {
    try {
        const order = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            ID.unique(),
            {
                user_id: userId,
                status: "SUBMITTED",
                total,
            }
        );

        await Promise.all(
            items.map((item) =>
                databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.orderItemsCollectionId,
                    ID.unique(),
                    {
                        order_id: order.$id,
                        menu_id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image_url: normalizeOrderItemImageUrl(item.image_url),
                    }
                )
            )
        );

        return order;
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getOrderItems = async ({ orderId }: { orderId: string }) => {
    try {
        const items = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.orderItemsCollectionId,
            [Query.equal("order_id", orderId)]
        );

        return items.documents;
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getOrdersByUser = async ({
    userId,
}: {
    userId: string;
}): Promise<OrderDoc[]> => {
    try {
        const orders = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            [Query.equal("user_id", userId), Query.orderDesc("$createdAt")]
        );

        return orders.documents as OrderDoc[];
    } catch (e) {
        throw new Error(e as string);
    }
};
