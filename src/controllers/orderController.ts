// src/controllers/bookController.ts
import { Request, Response } from 'express';
import OrderService from '../services/orderService';
import { Order, OrderBook, OrderPayload } from '../types/order';

const getOrders = async (req: Request, res: Response) => {
  try {
    const books = await OrderService.getOrders();
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const total_quantity = req.body.books.reduce((total: number, book: { quantity: number }) => total + book.quantity, 0);

    const total_points = req.body.books.reduce((total: number, book: { point: number }) => total + book.point, 0);
    
    const payload: OrderPayload = 
      {
        customer_id : req.user?.id,
        books: req.body.books,
        total_quantity,
        total_points
      }
    
    const order = await OrderService.createOrder(payload);
    
    return res.status(200).json(order);
  } catch (error) {
    if (typeof error === "string") {
      console.error('Error:', error);
      return res.status(500).json({ message: error });   
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: JSON.parse(error.message) });
    } else {
      console.error('Unknown error:', error);
      return res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};

export { getOrders, createOrder };
