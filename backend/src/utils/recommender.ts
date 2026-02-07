import { TfIdf } from 'natural';
import { getAllProducts } from '../db/allproducts';
import { Product } from '../type/type';
import pool from '../db/pool';

let tfidf = new TfIdf();
let productMap: Product[] = [];
let isInitialized = false;

interface HistoryRow {
    name: string;
    category: string;
    description: string;
    weight: number;
}


export const initRecommender = async () => {
    if (isInitialized) return;

    try {
        console.log("Initializing Recommendation Engine...");
        const products = await getAllProducts();

        // Reset state
        tfidf = new TfIdf();
        productMap = products as Product[];

        productMap.forEach((product) => {
            // Create a content string for TF-IDF
            // Weight name higher by repeating it
            const content = `${product.name} ${product.name} ${product.category} ${product.brand || ''} ${product.description || ''}`;
            tfidf.addDocument(content);
        });

        isInitialized = true;
        console.log(`Recommender initialized with ${productMap.length} products.`);
    } catch (error) {
        console.error("Failed to initialize recommender:", error);
    }
};

export const searchWithRelevance = async (query: string): Promise<Product[]> => {
    if (!isInitialized) await initRecommender();

    const results: { index: number, measure: number }[] = [];

    // Calculate TF-IDF scores for the query against all documents
    tfidf.tfidfs(query, (i, measure) => {
        // Only include results with a positive score
        if (measure > 0) {
            results.push({ index: i, measure });
        }
    });

    // Sort by relevance score (descending)
    results.sort((a, b) => b.measure - a.measure);

    // Map back to product objects
    return results.map(r => productMap[r.index]);
};

export const getRelatedProducts = async (productId: string | number, limit: number = 5): Promise<Product[]> => {
    if (!isInitialized) await initRecommender();

    const product = productMap.find(p => p.id == productId);
    if (!product) return [];

    // Use product attributes to find similar items
    const query = `${product.name} ${product.category}`;

    // Get all relevant results
    const results = await searchWithRelevance(query);

    // Filter out the original product and take top N
    return results.filter(p => p.id != productId).slice(0, limit);
};

export const getPersonalizedRecommendations = async (userId: number, limit: number = 5): Promise<Product[]> => {
    if (!isInitialized) await initRecommender();

    // 1. Get user's interaction history (views and purchases)
    // We weight purchases higher than views
    const historyRes = await pool.query(`
        SELECT 
            p.name, p.category, p.description,
            CASE WHEN ui.interaction_type = 'purchase' THEN 5 ELSE 1 END as weight
        FROM user_interactions ui
        JOIN (
             -- Union of all product tables to get details. 
             -- This is simplified; in production, you'd have a products table or materialized view
             SELECT id, name, category, description, 'industrial_hard_hat' as tname FROM industrial_hard_hat
             UNION ALL SELECT id, name, category, description, 'industrial_safety_gloves' as tname FROM industrial_safety_gloves
             UNION ALL SELECT id, name, category, description, 'industrial_power_tools' as tname FROM industrial_power_tools
             UNION ALL SELECT id, name, category, description, 'industrial_safety_glasses' as tname FROM industrial_safety_glasses
        ) p ON ui.product_id = p.id AND ui.category = p.category
        WHERE ui.user_id = $1
        ORDER BY ui.created_at DESC
        LIMIT 20
    `, [userId]);

    if (historyRes.rows.length === 0) {
        return []; // Cold start: return generic popular items or random (handled by caller)
    }

    // 2. Construct a "User Profile Vector" (string) from their history
    let userQuery = "";
    (historyRes.rows as HistoryRow[]).forEach(row => {
        // Repeat keywords based on weight
        const keywords = `${row.name} ${row.category} `;
        for (let i = 0; i < row.weight; i++) {
            userQuery += keywords;
        }
    });

    // 3. Find products similar to this user profile
    // We reuse the searchWithRelevance logic but with this rich query
    const results = await searchWithRelevance(userQuery);

    // 4. Filter out items they already bought (optional, but good for discovery)
    // For now, we just return the most relevant items
    return results.slice(0, limit);
};

export const trackInteraction = async (userId: number, productId: string | number, category: string, type: 'view' | 'purchase' = 'view') => {
    try {
        await pool.query(
            "INSERT INTO user_interactions (user_id, product_id, category, interaction_type) VALUES ($1, $2, $3, $4)",
            [userId, productId, category, type]
        );
    } catch (e) {
        console.error("Failed to track interaction:", e);
    }
};
