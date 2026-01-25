import { supabase } from "./supabaseConfig";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[];
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

const data = dummyData as DummyData;

const clearTable = async (table: string, filterColumns: string[] = ["id"]) => {
    let lastError: string | null = null;
    for (const column of filterColumns) {
        const { error } = await supabase
            .from(table)
            .delete()
            .not(column, "is", null);

        if (!error) return;

        lastError = `Failed to clear ${table} using ${column}: ${error.message}`;
        if (error.code !== "42703") {
            throw new Error(lastError);
        }
    }

    if (lastError) {
        throw new Error(lastError);
    }
};

async function seed(): Promise<void> {
    await clearTable("menu_customizations", ["id", "menu_id"]);
    await clearTable("menu");
    await clearTable("customizations");
    await clearTable("categories");

    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const { data: row, error } = await supabase
            .from("categories")
            .insert({
                name: cat.name,
                description: cat.description,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to insert category ${cat.name}: ${error.message}`);
        }

        categoryMap[cat.name] = row.id;
    }

    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const { data: row, error } = await supabase
            .from("customizations")
            .insert({
                name: cus.name,
                price: cus.price,
                type: cus.type,
            })
            .select()
            .single();

        if (error) {
            throw new Error(
                `Failed to insert customization ${cus.name}: ${error.message}`
            );
        }

        customizationMap[cus.name] = row.id;
    }

    for (const item of data.menu) {
        const categoryId = categoryMap[item.category_name];
        if (!categoryId) {
            throw new Error(
                `Missing category for ${item.name}: ${item.category_name}`
            );
        }

        const { data: menuRow, error } = await supabase
            .from("menu")
            .insert({
                name: item.name,
                description: item.description,
                image_url: item.image_url,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                category_id: categoryId,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to insert menu item ${item.name}: ${error.message}`);
        }

        for (const cusName of item.customizations) {
            const customizationId = customizationMap[cusName];
            if (!customizationId) {
                throw new Error(
                    `Missing customization ${cusName} for item ${item.name}`
                );
            }

            const { error: mapError } = await supabase
                .from("menu_customizations")
                .insert({
                    menu_id: menuRow.id,
                    customization_id: customizationId,
                });

            if (mapError) {
                throw new Error(
                    `Failed to link customization ${cusName} for ${item.name}: ${mapError.message}`
                );
            }
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;
