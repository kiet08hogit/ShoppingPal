import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { initDB } from './db/dbinit';
import { requireAuth } from './middleware/auth.middleware';
import cartRoutes from './routes/cart.route';
import orderRoutes from './routes/order.route';
import allProductsRoutes from './routes/allproductsroute';
import userRoutes from './routes/user.route';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/products', allProductsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Initialize DB
initDB();

// Mount Auth Routes
// All routes in authRoutes will be prefixed with /auth
// e.g. /auth/register
// app.use("/auth", authRoutes);
// Basic test route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to ShoppingPal" });
});

// PROTECTED ROUTE EXAMPLE
// app.get('/me', requireAuth, (req: any, res: any) => { ... });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
