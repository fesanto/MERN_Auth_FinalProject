'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './profile.module.css';

// Instead of uses import { Review } from '@/types';, define it here
interface Review {
    _id: string;
    book: { googleBooksId: string; title?: string; authors?: string[]; };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMyReviews = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my-reviews`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMyReviews(response.data);
            } catch (error) {
                console.error("Error retrieving my reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyReviews();
    }, [router]);

    if (isLoading) {
        return <div className={styles.loading}>Loading your profile...</div>;
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>My Reviews</h1>
            {myReviews.length > 0 ? (
                <div className={styles.reviewsGrid}>
                    {myReviews.map(review => (
                        <div key={review._id} className={styles.reviewCard}>
                            <p><strong>Book:</strong> <a href={`/book/${review.book.googleBooksId}`}>{review.book.title || review.book.googleBooksId}</a></p>
                            {review.book.authors && <p className={styles.authors}>by {review.book.authors.join(', ')}</p>}
                            <p><strong>Rating:</strong> {review.rating}/5</p>
                            <p>"{review.comment}"</p>
                            <p className={styles.date}>Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noReviews}>You haven't written any reviews yet.</p>
            )}
        </main>
    );
}