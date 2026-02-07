import pool from "./pool";
import { Order, OrderItem } from "../type/type";
import { getCart } from "./cart";
import { allowedTables } from "./allproducts";

export const createOrder = async (userId: number): Promise<Order> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Get current cart
        // We use the existing getCart logic but we need the raw items first to calculate price
        // Actually getCart returns enriched items, which is perfect for getting the current price!
        const cart = await getCart(userId);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // 2. Calculate Total Amount
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + ((item.price || 0) * item.quantity);
        }, 0);

        // 3. Create Order Record
        const orderRes = await client.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'completed') RETURNING *",
            [userId, totalAmount]
        );
        const order = orderRes.rows[0];

        // 4. Move items to Order Items
        for (const item of cart.items) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, category, quantity, price_at_purchase) VALUES ($1, $2, $3, $4, $5)",
                [order.id, item.product_id, item.category, item.quantity, item.price || 0]
            );
        }

        // 5. Clear Cart (or at least the items)
        await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);

        await client.query('COMMIT');
        return order;

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const getOrders = async (userId: number): Promise<Order[]> => {
    // 1. Get Orders
    const ordersRes = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    const orders = ordersRes.rows;

    // 2. Enrich each order with items (similar to Cart logic but nested)
    const enrichedOrders = await Promise.all(orders.map(async (order) => {
        const itemsRes = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
        const items: OrderItem[] = itemsRes.rows;

        const enrichedItems = await Promise.all(items.map(async (item) => {
            const tableName = allowedTables[item.category];
            if (!tableName) return item;

            try {
                const productRes = await pool.query(
                    `SELECT name, image_url FROM ${tableName} WHERE id = $1`,
                    [item.product_id]
                );
                if (productRes.rows.length > 0) {
                    return {
                        ...item,
                        name: productRes.rows[0].name,
                        image_url: productRes.rows[0].image_url
                    };
                }
            } catch (e) {
                // ignore missing products in history
            }
            return item;
        }));

        return { ...order, items: enrichedItems };
    }));

    return enrichedOrders;
};

export const getOrderById = async (userId: number, orderId: number): Promise<Order | null> => {
    // Reuse logic or simplify for Hackathon
    const orders = await getOrders(userId); // inefficient but fast to implement
    return orders.find(o => o.id === orderId) || null;
}