import pool from "./pool";
import { Product } from "../type/type";

export const allowedTables: Record<string, string> = {
    "hard_hat": "industrial_hard_hat",
    "industrial_hard_hat": "industrial_hard_hat",
    "safety_gloves": "industrial_safety_gloves",
    "industrial_safety_gloves": "industrial_safety_gloves",
    "power_tools": "industrial_power_tools",
    "industrial_power_tools": "industrial_power_tools",
    "safety_glasses": "industrial_safety_glasses",
    "industrial_safety_glasses": "industrial_safety_glasses",
};

export const getProductsByCategory = async (category: string) => {
    const table = allowedTables[category];
    if (!table) {
        throw new Error("Invalid category");
    }
    const query = `SELECT * FROM ${table}`;
    const result = await pool.query(query);
    return result.rows;
}


export const getProductById = async (category: string, id: string) => {
    const table = allowedTables[category];
    if (!table) {
        throw new Error("Invalid category");
    }
    const query = `SELECT * FROM ${table} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

const primaryCategories = [
    { name: 'hard_hat', table: 'industrial_hard_hat' },
    { name: 'safety_gloves', table: 'industrial_safety_gloves' },
    { name: 'power_tools', table: 'industrial_power_tools' },
    { name: 'safety_glasses', table: 'industrial_safety_glasses' }
];

export const getAllProducts = async () => {
    const queries = primaryCategories.map(cat =>
        `SELECT *, '${cat.name}' as category FROM ${cat.table}`
    );
    const finalQuery = queries.join(' UNION ALL ');
    const result = await pool.query(finalQuery);
    return result.rows;
}

export const searchProducts = async (searchQuery: string) => {
    const queries = primaryCategories.map(cat =>
        `SELECT *, '${cat.name}' as category FROM ${cat.table} WHERE name ILIKE $1`
    );
    const finalQuery = queries.join(' UNION ALL ');

    const result = await pool.query(finalQuery, [`%${searchQuery}%`]);
    return result.rows;
}
