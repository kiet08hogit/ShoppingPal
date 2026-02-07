import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: any; // We will attach the user payload here
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get the header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // 2. Extract the token
    // Format: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Invalid token format." });
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // 4. Attach user info to request
        req.user = decoded;

        // 5. Continue to the next step (the route handler)
        next();

    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
