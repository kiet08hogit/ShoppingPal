import { Request, Response } from 'express';
import * as orderDb from '../db/orders';

const getUserId = (req: Request): number => {
    // @ts-ignore
    return req.user?.id || 1;
};

export const createOrderController = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const order = await orderDb.createOrder(userId);
        res.status(201).json(order);
    } catch (error: any) {
        console.error(error);
        if (error.message === "Cart is empty") {
            res.status(400).json({ message: "Cart is empty" });
        } else {
            res.status(500).json({ message: "Error creating order" });
        }
    }
};

export const getOrdersController = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const orders = await orderDb.getOrders(userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const order = await orderDb.getOrderById(userId, parseInt(id as string));
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching order" });
    }
}