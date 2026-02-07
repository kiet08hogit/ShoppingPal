import { Request, Response } from 'express';
import { getProductById, getProductsByCategory, searchProducts, getAllProducts } from '../db/allproducts';
import { searchWithRelevance, getRelatedProducts, trackInteraction } from '../utils/recommender';

export const getProductsByCategorycontroller = async (req: Request<{ category: string }>, res: Response) => {
    const { category } = req.params;
    try {
        const products = await getProductsByCategory(category);
        if (!products) {
            return res.status(404).json({ error: "Products not found" });
        }
        else {
            return res.status(200).json(products);
        }
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return res.status(400).json({ error: error.message || "Bad Request" });
    }
};

export const getProductByIdcontroller = async (req: Request<{ category: string, id: string }>, res: Response) => {
    const { category, id } = req.params;
    try {
        const product = await getProductById(category, id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Track View (fire and forget)
        // @ts-ignore
        const userId = req.user?.id; // Will be undefined if not logged in, which is handled
        if (userId) {
            trackInteraction(userId, id, category, 'view');
        }

        return res.status(200).json(product);
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return res.status(400).json({ error: error.message || "Bad Request" });
    }
};

export const getAllProductsController = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();
        return res.status(200).json(products);
    } catch (error: any) {
        console.error("Error fetching all products:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const searchProductsController = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query 'q' is required" });
    }

    try {
        // Use TF-IDF recommendation model for search
        const results = await searchWithRelevance(q);
        return res.status(200).json(results);
    } catch (error: any) {
        console.error("Error searching products:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getRecommendationsController = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "Product ID is required" });
    }
    try {
        const recommendations = await getRelatedProducts(id);
        if (!recommendations) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json(recommendations);
    } catch (error: any) {
        console.error("Error fetching recommendations:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



