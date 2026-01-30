import { ImageSourcePropType } from 'react-native';

//base types
export interface BaseRow {
    id: string;
    created_at?: string;
}

//database table types
export interface User extends BaseRow {
    name: string;
    email: string;
    role: 'employee' | 'manager';
    avatar?: string;
}

export interface InventoryItem extends BaseRow {
    name: string;
    category: 'fish' | 'prep' | 'dry' | 'cold' | 'frozen';  // Strict union type
    supplier_category: 'fish_supplier' | 'main_distributor' | 'local_store';
    base_unit: 'lb' | 'oz' | 'each';
    pack_unit: 'case' | 'box' | 'bag';
    pack_size: number;
    image_url?: string;
    active: boolean;
}

export interface Order extends BaseRow {
    order_number: number;
    user_id: string;
    status: 'pending' | 'processing' | 'fulfilled';
    notes?: string;
    fulfilled_at?: string;
    fulfilled_by?: string;
    order_items?: OrderItem[];
}

export interface OrderItem extends BaseRow {
    order_id: string; 
    inventory_item_id: string;
    quantity: number;
    unit_type: 'case' | 'each' | 'lb';
    checked: boolean;
    inventory_item?: InventoryItem;
}

//api parameters types
export interface CreateUserParams {
    email: string;
    password: string;
    name: string;
    role: 'employee' | 'manager';
}

export interface SignInParams {
    email: string;
    password: string;   
}

export interface CreateInventoryItemParams {
    name: string;
    category: 'fish' | 'prep' | 'dry' | 'cold' | 'frozen';
    supplier_category: 'fish_supplier' | 'main_distributor' | 'local_store';
    base_unit: 'lb' | 'oz' | 'each';
    pack_unit: 'case' | 'box' | 'bag';
    pack_size: number;
    image_url?: string;
    active: boolean;
}

export interface UpdateInventoryItemParams extends Partial<CreateInventoryItemParams> {
    id: string;
}

export interface GetInventoryItemsParams {
    category?: 'fish' | 'prep' | 'dry' | 'cold' | 'frozen';
    query?: string;
    active?: boolean;
}

export interface CreateOrderParams {
    user_id: string;
    notes?: string;
    items: CreateOrderItemParams[];
}

export interface CreateOrderItemParams {
    inventory_item_id: string;
    quantity: number;
    unit_type: 'case' | 'each' | 'lb';
}

export interface UpdateOrderParams {
    id: string;
    status?: 'pending' | 'processing' | 'fulfilled';
    notes?: string;
    fulfilled_by?: string;
    fulfilled_at?: string;
}

export interface GetOrdersParams {
    user_id?: string;
    status?: 'pending' | 'processing' | 'fulfilled';
}

//component props types
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

//store types (zustand)
export interface AuthStore {
    user: User | null;
    session: any | null;
    isLoading: boolean;

    signIn: (params: SignInParams) => Promise<void>;
    signUp: (params: CreateUserParams) => Promise<void>;
    signOut: () => Promise<void>;
    fetchAuthenticatedUser: () => Promise<void>;
}

export interface CartItem {
    inventory_item: InventoryItem;
    quantity: number;
    unit_type: 'case' | 'each' | 'lb';
}

export interface CartStore {
    items: CartItem[];
    addItem: (item: InventoryItem, quantity: number, unit_type: 'case' | 'each' | 'lb') => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
}