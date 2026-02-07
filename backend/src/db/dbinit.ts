import pool from "./pool";

export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(100), -- Made nullable for Clerk users
                clerk_id VARCHAR(255) UNIQUE -- Added for Clerk integration
            );

            -- Add clerk_id column if it doesn't exist (for existing tables)
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='clerk_id') THEN
                    ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255) UNIQUE;
                END IF;

                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password' AND is_nullable='NO') THEN
                    ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN
                    ALTER TABLE users ADD COLUMN address TEXT;
                END IF;
            END $$;

            CREATE TABLE IF NOT EXISTS carts (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
                product_id INT NOT NULL,
                category VARCHAR(50) NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(cart_id, product_id, category)
            );
        `);
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};
