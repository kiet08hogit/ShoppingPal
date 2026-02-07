import { Request, Response } from 'express';
import pool from '../db/pool';

export const getProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await pool.query("SELECT id, email, address FROM users WHERE id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
};

export const createOrUpdateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user?.id;
        // @ts-ignore
        const clerkId = req.user?.clerkId;
        const { address, email } = req.body;

        if (userId) {
            // Update existing user
            await pool.query("UPDATE users SET address = $1 WHERE id = $2", [address, userId]);
            res.json({ message: "Profile updated" });
        } else if (clerkId) {
            // Create or update by clerk_id
            // Check if user exists
            const userRes = await pool.query("SELECT * FROM users WHERE clerk_id = $1", [clerkId]);
            if (userRes.rows.length > 0) {
                await pool.query("UPDATE users SET address = $1 WHERE clerk_id = $2", [address, clerkId]);
                res.json({ message: "Profile updated" });
            } else {
                // Create new user (should normally be done on signup, but lazy creation here)
                await pool.query("INSERT INTO users (clerk_id, email, address) VALUES ($1, $2, $3)", [clerkId, email || "", address]);
                res.json({ message: "Profile created" });
            }
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
};
