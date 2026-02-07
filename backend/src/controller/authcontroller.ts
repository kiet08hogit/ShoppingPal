import { Request, Response } from "express";

export const getMe = async (req: Request | any, res: Response): Promise<any> => {
    try {
        // The middleware already gave us the user data in req.user
        // associated with the Clerk ID

        if (!req.user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user: req.user });
    } catch (error: any) {
        console.error("GetMe Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
