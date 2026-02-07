import { Request, Response } from 'express';
import { getProductById, getProductsByCategory, searchProducts } from '../db/allproducts';



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
        return res.status(200).json(product);
    } catch (error: any) {
        console.error("Error fetching product:", error);
        return res.status(400).json({ error: error.message || "Bad Request" });
    }
};

export const searchProductsController = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query 'q' is required" });
    }

    try {
        const results = await searchProducts(q);
        return res.status(200).json(results);
    } catch (error: any) {
        console.error("Error searching products:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



