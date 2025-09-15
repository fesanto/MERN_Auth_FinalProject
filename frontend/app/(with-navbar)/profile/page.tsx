'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import styles from './profile.module.css';

// Interface para os dados do utilizador
interface User {
    _id: string;
    name: string;
    email: string;
}

// Instead of uses import { Review } from '@/types';, define it here
interface Review {
    _id: string;
    book: { googleBooksId: string; title?: string; authors?: string[]; };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const userPromise = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const reviewsPromise = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my-reviews`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const [userResponse, reviewsResponse] = await Promise.all([userPromise, reviewsPromise]);

                setUser(userResponse.data);
                setMyReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Error retrieving my reviews:", error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleEditClick = () => {
        if (user) {
            setNewName(user.name);
            setIsEditing(true);
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || !user) return;

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(response.data);
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('The profile could not be updated. Please try again.');
            console.error("Error updating profile:", err);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading your profile...</div>;
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.pageTitle}>My Profile</h1>

            <section className={styles.accountDetails}>
                <h2 className={styles.sectionTitle}>Account Details</h2>
                {user && (
                    <>
                        {isEditing ? (
                            <div className={styles.editProfileForm}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name" className={styles.label}>Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>E-mail:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className={styles.input}
                                    />
                                </div>
                                {error && <p className={styles.error}>{error}</p>}
                                <div className={styles.accountActions}>
                                    <button onClick={handleUpdateProfile} className={styles.saveButton}>Save</button>
                                    <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.detailsContent}>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>E-mail:</strong> {user.email}</p>
                                </div>
                                <div className={styles.accountActions}>
                                    <button onClick={handleEditClick} className={styles.editButton}>Edit Profile</button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </section>

            <section className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>My Reviews</h2>
                {myReviews.length > 0 ? (
                    <div className={styles.reviewsGrid}>
                        {myReviews.map(review => (
                            <div key={review._id} className={styles.reviewCard}>
                                <p>
                                    <strong>Livro:</strong>{' '}
                                    <Link href={`/book/${review.book.googleBooksId}`} className={styles.bookLink}>
                                        {review.book.title || review.book.googleBooksId}
                                    </Link>
                                </p>
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
            </section>
        </main>
    );
}