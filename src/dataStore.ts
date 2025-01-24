// Define the shape of an item:
export interface Item {
	id: string;
	name: string;
	description: string;
	price: number;
	availability: boolean;
}

export interface QueryParams {
	name: string;
	minPrice: string;
	maxPrice: string;
}

// Our in-memory store of items:
export const items: Item[] = [{ id: 'firstItem', name: 'Test Item', description: 'this is a test item', price: 55.0, availability: true }];
