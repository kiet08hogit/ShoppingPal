import { Request, Response } from 'express';
import * as cartDb from '../db/cart';

// Helper to get userId from request (assuming auth middleware populates it)
// For now, we might need to mock it or expect it in body if auth not fully set up
const getUserId = (req: Request): number => {
    // @ts-ignore
    if (!req.user || !req.user.id) {
        throw new Error("User not authenticated");
    }
    // @ts-ignore
    return req.user.id;
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        let cart = await cartDb.getCart(userId);
        if (!cart) {
            cart = await cartDb.createCart(userId);
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching cart" });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { productId, category, quantity } = req.body;

        if (!productId || !category) {
            res.status(400).json({ message: "Product ID and Category are required" });
            return; // Explicitly return
        }

        await cartDb.addToCart(userId, productId, category, quantity || 1);
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding to cart" });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const { quantity } = req.body;

        await cartDb.updateCartItem(userId, parseInt(id as string), quantity);
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating cart item" });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        await cartDb.removeFromCart(userId, parseInt(id as string));
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing from cart" });
    }
};
