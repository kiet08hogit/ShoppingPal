// Common ID type
export type ID = number | string;

// Product type
export interface Product {
	id: ID;
	name: string;
	// Legacy fields (Mock Data)
	image?: string;
	description?: string;

	// Database Fields
	brand?: string;
	category?: string;
	main_category?: string;
	sku?: string;
	item_number?: string;
	price?: number;
	url?: string;
	image_url?: string; // Corresponds to DB image_url
	specifications?: Record<string, string>;
	created_at?: Date;
}

// User type (basic example)
export interface User {
	id: ID;
	email: string;
	password?: string; // hashed password, optional for security
}

export interface CartItem {
	id: ID;
	cart_id: ID;
	product_id: ID;
	category: string;
	quantity: number;
	// Joined fields for display
	name?: string;
	price?: number;
	image_url?: string;
}

export interface Cart {
	id: ID;
	user_id: ID;
	items: CartItem[];
}