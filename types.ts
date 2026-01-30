import { ImageSourcePropType } from 'react-native';

//category config

export const CATEGORIES = [
    { key: 'fish', label: 'Fish & Seafood', emoji: '🐟' },
    { key: 'protein', label: 'Proteins', emoji: '🥩' },
    { key: 'produce', label: 'Produce', emoji: '🥬' },
    { key: 'dry', label: 'Dry Goods', emoji: '🍚' },
    { key: 'dairy_cold', label: 'Dairy & Cold', emoji: '🧈' },
    { key: 'frozen', label: 'Frozen', emoji: '🧊' },
    { key: 'sauces', label: 'Sauces', emoji: '🥫' },
    { key: 'packaging', label: 'Packaging', emoji: '📦' },
] as const;

// Extract type from the array: 'fish' | 'protein' | 'produce' | ...
export type CategoryKey = typeof CATEGORIES[number]['key'];

// Helper function to get category info by key
export function getCategoryInfo(key: string) {
    return CATEGORIES.find(c => c.key === key) || { key, label: key, emoji: '📦' };
}

// unit types

export type BaseUnit = 
    | 'lb' | 'oz' | 'each' | 'bunch' | 'head' 
    | 'gal' | 'sheet' | 'piece' | 'pair' | 'roll' | 'pack';

export type PackUnit = 
    | 'case' | 'box' | 'bag' | 'bundle' | 'bottle' | 'pack'
    | 'jar' | 'container' | 'fillet' | 'loin' | 'piece'
    | 'jug' | 'tube' | 'can' | 'sleeve' | 'block' | 'each';

export type OrderUnit = 
    | 'case' | 'each' | 'lb' | 'oz' | 'bag' | 'box' | 'bundle'
    | 'bottle' | 'gal' | 'pack' | 'jar' | 'roll' | 'pair'
    | 'container' | 'fillet' | 'loin' | 'piece' | 'jug' | 'tube' | 'can' | 'sleeve';

export type SupplierCategory = 'fish_supplier' | 'main_distributor' | 'specialty' | 'asian_market';
export type SupplierType = 'fish' | 'general' | 'specialty' | 'asian_market';
export type OrderStatus = 'pending' | 'processing' | 'fulfilled' | 'cancelled';
export type UserRole = 'employee' | 'manager';

//Database types

export interface Location {
    id: string;
    name: string;
    short_code: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    default_location_id: string | null;  // Can be null if not set
    avatar_url: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: CategoryKey;
    supplier_category: SupplierCategory;
    base_unit: string;        // Using string for flexibility
    pack_unit: string | null;
    pack_size: number | null;
    image_url: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    order_number: number;
    user_id: string;
    location_id: string;
    status: OrderStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
    fulfilled_at: string | null;
    fulfilled_by: string | null;
}

export interface OrderItem {
    id: string;
    order_id: string;
    inventory_item_id: string;
    quantity: number;
    unit_type: string;
    checked: boolean;
    created_at: string;
}

export interface Supplier {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    supplier_type: SupplierType;
    is_default: boolean;
    notes: string | null;
    created_at: string;
}

//extended types

export interface OrderWithDetails extends Order {
    user: Pick<User, 'id' | 'name' | 'email'>;
    location: Pick<Location, 'id' | 'name' | 'short_code'>;
    item_count: number;
}

export interface OrderWithItems extends Order {
    user: Pick<User, 'id' | 'name' | 'email'>;
    location: Pick<Location, 'id' | 'name' | 'short_code'>;
    items: OrderItemWithInventory[];
}

export interface OrderItemWithInventory extends OrderItem {
    inventory_item: InventoryItem;
}

//draft types

export interface DraftItem {
    inventoryItem: InventoryItem;
    quantity: number;
    unit: string;
    addedAt: string;  // ISO timestamp
}

export interface LocationBreakdown {
    location_id: string;
    location_name: string;
    quantity: number;
}

export interface OrderBreakdown {
    order_id: string;
    order_number: number;
    quantity: number;
    location_id: string;
}

// Aggregated view: "Total salmon across all orders"
export interface AggregatedItem {
    inventoryItem: InventoryItem;
    totalQuantity: number;
    unit: string;
    locationBreakdown: LocationBreakdown[];  // Per-location totals
    orders: OrderBreakdown[];                // Which orders need this
}

//api types

export interface CreateOrderData {
    userId: string;
    locationId: string;
    items: {
        inventoryItemId: string;
        quantity: number;
        unitType: string;
    }[];
    notes?: string;
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    defaultLocationId?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface OrderStats {
    pending: number;
    today: number;
    fulfilledThisWeek: number;
}

//component props

export interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

export interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: string;
}

export interface CustomCardProps {
    children: React.ReactNode;
    className?: string;
    onPress?: () => void;
}

export interface BadgeProps {
    text: string | number;
    variant?: 'default' | 'success' | 'warning' | 'error';
    className?: string;
}

export interface CustomHeaderProps {
    title?: string;
    showBack?: boolean;
    rightComponent?: React.ReactNode;
}

export interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

//store types

export interface AuthStore {
    user: User | null;
    session: any | null;
    isLoading: boolean;
    signIn: (params: SignInData) => Promise<void>;
    signUp: (params: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    fetchAuthenticatedUser: () => Promise<void>;
}

export interface LocationStore {
    locations: Location[];
    selectedLocation: Location | null;
    isLoading: boolean;
    fetchLocations: () => Promise<void>;
    setSelectedLocation: (location: Location) => void;
}

export interface DraftStore {
    items: DraftItem[];
    addItem: (item: InventoryItem, quantity: number, unit: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearDraft: () => void;
    getTotalItems: () => number;
}

export interface CartItem {
    inventory_item: InventoryItem;
    quantity: number;
    unit_type: string;
}

export interface CartStore {
    items: CartItem[];
    addItem: (item: InventoryItem, quantity: number, unit_type: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
}