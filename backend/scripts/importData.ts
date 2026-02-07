import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Client } from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL not found in .env");
    process.exit(1);
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const DATA_DIR = path.join(__dirname, '../../data/Industrial_dataset/industrial_data');

// Sanitize filename to be a valid SQL table name
function getTableName(fileName: string): string {
    return 'industrial_' + fileName.replace('.csv', '').toLowerCase()
        .replace(/[^a-z0-9_]/g, '_'); // Replace non-alphanumeric with _
}

async function createTable(tableName: string) {
    // Drop table to ensure new schema is applied
    await client.query(`DROP TABLE IF EXISTS ${tableName}`);

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            brand TEXT,
            category TEXT,
            main_category TEXT,
            sku TEXT,
            item_number TEXT UNIQUE,
            price NUMERIC,
            url TEXT,
            image_url TEXT,
            description TEXT,
            specifications JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await client.query(createTableQuery);
    console.log(`Verified table '${tableName}' exists.`);

    // Clear data for fresh import (redundant after DROP but safe)
    await client.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY`);
}

async function importFile(filePath: string, fileName: string) {
    const tableName = getTableName(fileName);
    await createTable(tableName);

    // Derive category from filename (e.g. "Hard hat.csv" -> "Hard hat")
    const categoryName = fileName.replace('.csv', '');

    const results: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    console.log(`Processing ${fileName} into ${tableName} (${results.length} rows)...`);

                    for (const row of results) {
                        // CSV Columns: Product Name,Price,Rating,Number of Reviews,Prime,Availability,Description
                        const name = row['Product Name'];
                        const priceRaw = row['Price']; // e.g. "69." or "$69.99"
                        const description = row['Description'];
                        // URL column is removed in new CSVs

                        // Clean price
                        let priceVal = 0;
                        if (priceRaw) {
                            const cleanPrice = priceRaw.replace(/[^0-9.]/g, '');
                            priceVal = parseFloat(cleanPrice);
                        }

                        // Extra fields for specs
                        const specifications = {
                            rating: row['Rating'],
                            reviews: row['Number of Reviews'],
                            prime: row['Prime'],
                            availability: row['Availability']
                        };

                        // Generate a unique item_number since we don't have one
                        // Using a SHA256 of the name + description to ensure consistency across runs
                        const hash = crypto.createHash('sha256').update((name || '') + (description || '')).digest('hex').substring(0, 16);
                        const itemNumber = 'IND-' + hash.toUpperCase();

                        const query = `
                            INSERT INTO ${tableName} 
                            (name, brand, category, main_category, sku, item_number, price, url, description, specifications)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                            ON CONFLICT (item_number) DO NOTHING
                        `;
                        const values = [
                            name,
                            null, // Brand unknown
                            categoryName,
                            'Industrial', // Main category hardcoded for this dataset
                            null, // SKU unknown
                            itemNumber,
                            isNaN(priceVal) ? null : priceVal,
                            null, // URL unknown
                            description,
                            JSON.stringify(specifications)
                        ];

                        await client.query(query, values);
                    }
                    console.log(`Finished ${fileName}`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => reject(err));
    });
}

async function main() {
    try {
        await client.connect();
        console.log("Connected to Neon DB.");

        if (!fs.existsSync(DATA_DIR)) {
            throw new Error(`Directory not found: ${DATA_DIR}`);
        }

        const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));
        console.log(`Found ${files.length} CSV files to import.`);

        for (const file of files) {
            await importFile(path.join(DATA_DIR, file), file);
        }

        console.log("All imports finished successfully!");
    } catch (error) {
        console.error("Import failed:", error);
    } finally {
        await client.end();
    }
}

main();
