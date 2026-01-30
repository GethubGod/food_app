export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
    return password.length >= 6;
}

export function isValidQuantity(quantity: number): boolean {
    return quantity > 0 && Number.isFinite(quantity);
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validateSignUp(data: {
    email: string;
    password: string;
    name: string;
}): ValidationResult {
    const errors: string[] = [];

    if (!data.name.trim()) {
        errors.push('Name is required');
    }

    if (!isValidEmail(data.email)) {
        errors.push('Invalid email address');
    }

    if (!isValidPassword(data.password)) {
        errors.push('Password must be at least 6 characters');
    }

    return { isValid: errors.length === 0, errors };
}
