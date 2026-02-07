import { Request, Response } from "express";
import pool from "../db/pool";
import { hashPassword } from "../utils/password";
import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/password";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password, retype_password }: { email: string, password: string, retype_password: string } = req.body;

    // 1. Validation
    if (!email || !password || !retype_password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    if (password !== retype_password) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // 2. Hash the password
        const hashed: string = await hashPassword(password);

        // 3. Insert into DB
        // We use $1, $2 to prevent SQL Injection
        await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, hashed]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (error: any) {
        console.error("Register Error:", error);

        // Handle duplicate username error (Postgres code 23505)
        if (error.code === '23505') {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // 2. Find user by username
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Compare password
        const validPassword: boolean = await comparePassword(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 4. Generate JWT
        // We use process.env.JWT_SECRET directly. 
        // We use '!' to tell TypeScript we are sure it exists (or it will throw/fail safely)
        const token = jwt.sign(
            { email: user.rows[0].email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.json({ token });

    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req: Request | any, res: Response): Promise<any> => {
    try {
        // The middleware already gave us the user data in req.user
        // But let's fetch the FRESH data from the DB to be sure
        const email = req.user.email;

        const user = await pool.query(
            "SELECT id, email FROM users WHERE email = $1",
            [email]
        );

        res.json({ user: user.rows[0] });
    } catch (error: any) {
        console.error("GetMe Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
