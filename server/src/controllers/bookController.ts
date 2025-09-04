import { Request, Response } from 'express';
import axios from 'axios';

export const searchBooks = async (req: Request, res: Response) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Google Books API:', error);
        res.status(500).json({ message: 'Failed to fetch books from Google API' });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
    const API_URL = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching single book from Google Books API:', error);
        res.status(500).json({ message: 'Failed to fetch book details from Google API' });
    }
};
