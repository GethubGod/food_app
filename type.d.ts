export interface BaseRow {
    id: string;
    created_at?: string;
    updated_at?: string;
}

export interface MenuItem extends BaseRow {
    name: string;
    price: number;
    image_url: string;
    description: string;
    calories: number;
    protein: number;
    rating: number;
    type: string;
    category_id?: string;
}

export interface Category extends BaseRow {
    name: string;
    description: string;
}

export interface User extends BaseRow {
    name: string;
    email: string;
    avatar: string;
}

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
}

export interface CartItemType {
    id: string; // menu item id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
}

export interface CartStore {
    items: CartItemType[];
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string, customizations: CartCustomization[]) => void;
    increaseQty: (id: string, customizations: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

export interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

export interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

export interface CustomHeaderProps {
    title?: string;
}

export interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export interface ProfileFieldProps {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}

export interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

export interface GetMenuParams {
    category: string;
    query: string;
}

export interface CreateMenuItemParams {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    categoryId: string;
}

export interface OrderDoc extends BaseRow {
    user_id: string;
    status: string;
    total: number;
    order_items?: OrderItemDoc[];
}

export interface OrderItemDoc extends BaseRow {
    order_id: string;
    menu_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

export interface CreateOrderParams {
    userId: string;
    items: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        quantity: number;
    }[];
    total: number;
}
