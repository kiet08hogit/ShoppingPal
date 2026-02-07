import { Router } from "express";

import { getMe } from "../controller/authcontroller";

const router = Router();

import { requireAuth } from "../middleware/auth.middleware";

// POST /auth/register - REMOVED (Handled by Clerk)
// router.post("/register", register);

// POST /auth/login - REMOVED (Handled by Clerk)
// router.post("/login", login);

// GET /auth/me - Protected route to get current user
router.get("/me", requireAuth, getMe);

export default router;
