import pool from "./pool";
import { Cart, CartItem } from "../type/type";
import { allowedTables } from "./allproducts";

export const createCart = async (userId: number): Promise<Cart> => {
    const result = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
        [userId]
    );
    return { ...result.rows[0], items: [] };
};

export const getCart = async (userId: number): Promise<Cart | null> => {
    // 1. Get the cart
    const cartRes = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    if (cartRes.rows.length === 0) return null;

    const cart = cartRes.rows[0];

    // 2. Get cart items
    const itemsRes = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = $1",
        [cart.id]
    );
    let items: CartItem[] = itemsRes.rows;

    // 3. Enrich items with product details
    // This is the tricky part. We need to query different tables based on category.
    // Optimization: Group items by category to do batch queries per table.
    // For simplicity in MVP, we might do individual queries or Promise.all, 
    // but batching is better. Let's do a simple Promise.all mapping for now.

    const enrichedItems = await Promise.all(items.map(async (item) => {
        const tableName = allowedTables[item.category];
        if (!tableName) return item; // Should not happen if data integrity is kept

        try {
            const productRes = await pool.query(
                `SELECT name, price, image_url FROM ${tableName} WHERE id = $1`,
                [item.product_id]
            );
            if (productRes.rows.length > 0) {
                const product = productRes.rows[0];
                return {
                    ...item,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url
                };
            }
        } catch (e) {
            console.error(`Error fetching product details for item ${item.id}`, e);
        }
        return item;
    }));

    return { ...cart, items: enrichedItems };
};

export const addToCart = async (userId: number, productId: number, category: string, quantity: number) => {
    // 1. Ensure cart exists
    let cart = await getCart(userId);
    if (!cart) {
        cart = await createCart(userId);
    }

    // 2. Check if item exists in cart
    const existingItemRes = await pool.query(
        "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND category = $3",
        [cart.id, productId, category]
    );

    if (existingItemRes.rows.length > 0) {
        // Update quantity
        const newQuantity = existingItemRes.rows[0].quantity + quantity;
        await pool.query(
            "UPDATE cart_items SET quantity = $1 WHERE id = $2",
            [newQuantity, existingItemRes.rows[0].id]
        );
    } else {
        // Insert new item
        await pool.query(
            "INSERT INTO cart_items (cart_id, product_id, category, quantity) VALUES ($1, $2, $3, $4)",
            [cart.id, productId, category, quantity]
        );
    }
    return getCart(userId);
};

export const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
    // Verify ownership via join could be better, but for now simple update
    await pool.query(
        "UPDATE cart_items SET quantity = $1 FROM carts WHERE cart_items.cart_id = carts.id AND carts.user_id = $2 AND cart_items.id = $3",
        [quantity, userId, itemId]
    );
    return getCart(userId);
}

export const removeFromCart = async (userId: number, itemId: number) => {
    await pool.query(
        "DELETE FROM cart_items USING carts WHERE cart_items.cart_id = carts.id AND carts.user_id = $1 AND cart_items.id = $2",
        [userId, itemId]
    );
    return getCart(userId);
};
