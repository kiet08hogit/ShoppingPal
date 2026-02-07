import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import pool from "../db/pool";

// Extend Request to potentialy include our local user
declare global {
    namespace Express {
        interface Request {
            auth?: any; // Clerk auth object
            user?: any; // Our local user object
        }
    }
}

export const requireAuth = [
    // 1. Clerk Middleware: Verifies the token and attaches req.auth
    ClerkExpressWithAuth(),

    // 2. Sync Middleware: Ensures user exists in our DB
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.auth || !req.auth.userId) {
                return res.status(401).json({ error: "Unauthenticated" });
            }

            const clerkId = req.auth.userId;

            // Check if user exists in our DB
            const result = await pool.query("SELECT * FROM users WHERE clerk_id = $1", [clerkId]);

            if (result.rows.length > 0) {
                // User exists, attach to request
                req.user = result.rows[0];
                next();
            } else {
                // User doesn't exist, we need to sync
                // In a production app, you might fetch user details from Clerk here
                // For now, we'll create a basic record. 
                // Note: We might not have the email in the claim depending on config.
                // For simplicity in this migration, we'll use a placeholder or try to get it if available in session claims

                // clerkId is unique, so we can insert. Email is required by schema, so we need a value.
                // We can use the clerkId as a placeholder email or fetch from Clerk API if needed.
                // Let's assume we can get email from claims if we configured it, otherwise use a dummy for now 
                // OR better: Fetch user from Clerk (requires API call)
                // To keep it fast/simple for this step without extra API calls, we'll insert with a placeholder email pattern
                // that won't conflict. 

                const emailPlaceholder = `${clerkId}@clerk.user`; // Unique placeholder

                // Check if we can link by email (if user existed before Clerk)
                // This part is tricky without knowing the email. 
                // For a seamless migration of EXISTING users, they would need to have the same email in Clerk.
                // If we want to link, we'd need to fetch the email from Clerk.

                // For now, let's just insert/ignore.

                const newUser = await pool.query(
                    "INSERT INTO users (clerk_id, email) VALUES ($1, $2) RETURNING *",
                    [clerkId, emailPlaceholder]
                );

                req.user = newUser.rows[0];
                next();
            }
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({ error: "Internal Server Error during Auth" });
        }
    }
];
