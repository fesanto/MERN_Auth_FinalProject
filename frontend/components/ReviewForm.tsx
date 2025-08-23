'use client';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import Button from './Button';

interface ReviewFormProps {
    bookId: string;
    onReviewSubmitted: () => void;
}

export default function ReviewForm({ bookId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        console.log("Token sendo enviado:", token);

        if (!token) {
            setError('To leave a review, you must be logged in.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/reviews',
                { googleBooksId: bookId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment('');
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            setError('An error occurred while we were processing your feedback.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Please leave your opinion of this book.</h3>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
            </select>
            <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Please write your comment..."
                rows={4}
                required
                style={{ width: '100%', marginTop: '10px' }}
            />
            <Button type="submit">Post comment</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
} []