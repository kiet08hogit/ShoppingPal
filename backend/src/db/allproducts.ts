import pool from "./pool";
import { Product } from "../type/type";

export const allowedTables: Record<string, string> = {
    "hard_hat": "industrial_hard_hat",
    "safety_gloves": "industrial_safety_gloves",
    "power_tools": "industrial_power_tools",
    "safety_glasses": "industrial_safety_glasses",
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

export const getAllProducts = async () => {
    const tables = Object.values(allowedTables);
    const queries = tables.map(table => `SELECT * FROM ${table}`);
    const finalQuery = queries.join(' UNION ALL ');
    const result = await pool.query(finalQuery);
    return result.rows;
}

export const searchProducts = async (searchQuery: string) => {
    const tables = Object.values(allowedTables);
    // Construct a UNION ALL query to search across all tables
    // We select specific common columns or all columns if schemas are identical
    // Based on importData.ts, schemas for industrial_* tables are identical.

    const queries = tables.map(table => `SELECT * FROM ${table} WHERE name ILIKE $1`);
    const finalQuery = queries.join(' UNION ALL ');

    const result = await pool.query(finalQuery, [`%${searchQuery}%`]);
    return result.rows;
}


