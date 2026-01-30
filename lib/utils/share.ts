import { Share } from 'react-native';
import type { AggregatedItem } from '@/type';
import { getCategoryInfo } from '@/type';

export function generateOrderText(items: AggregatedItem[], supplierName?: string): string {
    const lines: string[] = [];
    
    if (supplierName) {
        lines.push(`Order for: ${supplierName}`);
        lines.push(`Date: ${new Date().toLocaleDateString()}`);
        lines.push('---');
    }

    // Group by category
    const byCategory = items.reduce((acc, item) => {
        const cat = item.inventoryItem.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, AggregatedItem[]>);

    for (const [category, categoryItems] of Object.entries(byCategory)) {
        const info = getCategoryInfo(category);
        lines.push(`\n${info.emoji} ${info.label}:`);
        
        for (const item of categoryItems) {
            lines.push(`  • ${item.inventoryItem.name}: ${item.totalQuantity} ${item.unit}`);
        }
    }

    return lines.join('\n');
}

export async function shareOrderText(text: string): Promise<void> {
    try {
        await Share.share({
            message: text,
        });
    } catch (error) {
        console.error('Error sharing:', error);
    }
}
