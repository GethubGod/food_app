import { supabase } from './supabaseConfig';
import { 
    Category, CreateMenuItemParams, CreateOrderParams, 
    CreateUserParams, GetMenuParams, MenuItem, OrderDoc, 
    SignInParams, User 
} from "@/type";

// --- AUTHENTICATION ---

export const signIn = async ({ email, password }: SignInParams) => {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw new Error(error.message);
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    // 1. Sign up the user in Auth system
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name } // Stores metadata
        }
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("User creation failed");

    // 2. Create the Public Profile in 'users' table
    const { error: profileError } = await supabase
        .from('users')
        .insert({
            id: data.user.id, // links to auth
            email: email,
            name: name,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=random` // Simple avatar generator
        });

    if (profileError) throw new Error(profileError.message);

    return data.user;
};

export const getCurrentUser = async (): Promise<User> => {
    // 1. Get logged in auth user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // 2. Fetch public profile
    const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw new Error(error.message);
    return userProfile;
};

// --- DATABASE ---

export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*');
        
    if (error) throw new Error(error.message);
    return data || [];
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
    let dbQuery = supabase.from('menu').select('*, categories(*)');

    // Filter by Category ID (assuming 'category' param is an ID string)
    if (category) {
       dbQuery = dbQuery.eq('category_id', category);
    }

    // Search by Name
    if (query) {
       dbQuery = dbQuery.ilike('name', `%${query}%`);
    }

    const { data, error } = await dbQuery;
    if (error) throw new Error(error.message);
    return data;
};

// export const createMenuItem = async ({
//     name, description, image_url, price, rating, calories, protein, categoryId,
// }: CreateMenuItemParams) => {
//     const { data, error } = await supabase
//         .from('menu')
//         .insert({
//             name, description, image_url, price, rating, calories, protein,
//             category_id: categoryId,
//         })
//         .select()
//         .single();

//     if (error) throw new Error(error.message);
//     return data;
// };

export const createOrder = async ({ userId, items, total }: CreateOrderParams) => {
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            status: "SUBMITTED",
            total,
        })
        .select()
        .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Create Order Items (Bulk Insert is faster in Supabase)
    const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    return order;
};

export const getOrdersByUser = async ({ userId }: { userId: string }): Promise<OrderDoc[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)') // Fetches related items automatically
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};