import {supabase} from './supabase';

export async function testConnection() {
    try{
        const {data, error} = await supabase
        .from('inventory_items')
        .select('name')
        .limit(1);

        if (error) {
            console.error('Error fetching data from Supabase:', error);
            return false;
        }

        console.log('Successfully fetched data from Supabase:');
        console.log('sample items:', data);
        return true;
    } catch (err) {
        console.error('Unexpected error:', err);
        return false;
    }
}