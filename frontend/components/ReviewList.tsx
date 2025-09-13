'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReviewList.module.css';

interface Review {
    _id: string;
    user: { _id: string; name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewListProps {
    reviews: Review[];
    onReviewDeleted: (reviewId: string) => void;
    onReviewUpdated: (updatedReview: Review) => void;
}

export default function ReviewList({ reviews, onReviewDeleted, onReviewUpdated }: ReviewListProps) {
    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editedComment, setEditedComment] = useState('');
    const [editedRating, setEditedRating] = useState(5);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setLoggedInUserId(userId);
    }, []);

    const handleEditClick = (review: Review) => {
        setEditingReviewId(review._id);
        setEditedComment(review.comment);
        setEditedRating(review.rating);
    };

    const handleDelete = async (reviewId: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                onReviewDeleted(reviewId);
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('The review could not be deleted.');
            }
        }
    };

    const handleUpdate = async (reviewId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `/reviews/${reviewId}`,
                { comment: editedComment, rating: editedRating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onReviewUpdated(response.data);
            setEditingReviewId(null);
        } catch (error) {
            console.error('Error updating review:', error);
            alert('The review could not be updated.');
        }
    };

    return (
        <div className={styles.listContainer}>
            <h3 className={styles.listTitle}>What do readers think?</h3>
            {reviews.length === 0 ? (
                <p>This book has no reviews yet. Be the first to write one!</p>
            ) : (
                reviews.map(review => (
                    <div key={review._id} className={styles.reviewCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.userName}>{review.user.name}</span>
                            <div className={styles.starRating}>
                                {[...Array(5)].map((_, index) => (
                                    <span key={index} className={index < review.rating ? styles.starFull : styles.starEmpty}>
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                        {editingReviewId === review._id ? (
                            <div className={styles.editContainer}>
                                <select
                                    value={editedRating}
                                    onChange={(e) => setEditedRating(Number(e.target.value))}
                                    className={styles.editSelect}
                                >
                                    <option value="5">★★★★★ (5 Stars)</option>
                                    <option value="4">★★★★☆ (4 Stars)</option>
                                    <option value="3">★★★☆☆ (3 Stars)</option>
                                    <option value="2">★★☆☆☆ (2 Stars)</option>
                                    <option value="1">★☆☆☆☆ (1 Star)</option>
                                </select>
                                <textarea
                                    value={editedComment}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                    className={styles.editTextarea}
                                    rows={4}
                                />
                                <div className={styles.editActions}>
                                    <button onClick={() => handleUpdate(review._id)} className={styles.saveButton}>Guardar</button>
                                    <button onClick={() => setEditingReviewId(null)} className={styles.cancelButton}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className={styles.comment}>{review.comment}</p>
                                <div className={styles.cardFooter}>
                                    <p className={styles.date}>
                                        Publicado em {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                    {loggedInUserId === review.user._id && (
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEditClick(review)} className={styles.editButton}>Editar</button>
                                            <button onClick={() => handleDelete(review._id)} className={styles.deleteButton}>Apagar</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}