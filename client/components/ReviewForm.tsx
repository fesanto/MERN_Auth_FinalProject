'use client';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import Button from './Button';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    bookId: string;
    onReviewSubmitted: () => void;
}

export default function ReviewForm({ bookId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('To leave a review, you must be logged in.');
            setIsLoading(false);
            return;
        }

        try {
            await api.post(`/reviews`,
                { googleBooksId: bookId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment('');
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            setError('An error occurred while we were processing your feedback.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.formTitle}>Please leave your opinion of this book.</h3>
            <div className={styles.inpoutGroup}>
                <label htmlFor="rating" className={styles.label}>Rating:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className={styles.select}
                >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                    <option value="2">★★☆☆☆ (2 Stars)</option>
                    <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="comment" className={styles.label}>Comment:</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Please write your comment..."
                    rows={4}
                    required
                    className={styles.textarea}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
}