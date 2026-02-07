import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { initDB } from './db/dbinit';
import { requireAuth } from './middleware/auth.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB (optional, better strictly controlled)
initDB();

// Mount Auth Routes
// All routes in authRoutes will be prefixed with /auth
// e.g. /auth/register
app.use("/auth", authRoutes);
// Basic test route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to ShoppingPal" });
});


// PROTECTED ROUTE
// Only accessible if you have a valid token
app.get('/me', requireAuth, (req: any, res: any) => {
    // req.user comes from the middleware!
    res.json({
        message: "You are authorized!",
        user: req.user
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
