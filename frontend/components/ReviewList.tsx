'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
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

    const handleError = (error: any, action: string) => {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
            console.error(`Error when ${action} the review (Status: ${axiosError.response.status}):`, axiosError.response.data);
            alert(`Error ${axiosError.response.status}: ${axiosError.response.data.message || `Unable to ${action} review.`}`);
        } else if (axiosError.request) {
            console.error(`Network error ${action} review:`, axiosError.request);
            alert('Network error: Unable to contact server.');
        } else {
            console.error(`Error configuring ${action} request:`, axiosError.message);
            alert(`An error occurred while preparing the request to ${action}.`);
        }
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
                handleError(error, 'delete');
            }
        }
    };

    const handleUpdate = async (reviewId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`,
                { comment: editedComment, rating: editedRating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onReviewUpdated(response.data);
            setEditingReviewId(null);
        } catch (error) {
            handleError(error, 'update');
        }
    };

    return (
        <div className={styles.listContainer}>
            <h3 className={styles.listTitle}>What do readers think?</h3>
            {reviews.length === 0 ? (
                <p>This book has no reviews yet. Be the first to write one!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className={styles.reviewCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.userName}>{review.user.name}</span>
                            {editingReviewId !== review._id && (
                                <div className={styles.starRating}>
                                    {[...Array(5)].map((_, index) => (
                                        <span key={index} className={index < review.rating ? styles.starFull : styles.starEmpty}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}
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
                                    <button onClick={() => handleUpdate(review._id)} className={styles.saveButton}>Save</button>
                                    <button onClick={() => setEditingReviewId(null)} className={styles.cancelButton}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className={styles.comment}>{review.comment}</p>
                                <div className={styles.cardFooter}>
                                    <p className={styles.date}>
                                        Posted on {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                    {loggedInUserId === review.user._id && (
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEditClick(review)} className={styles.editButton}>Edit</button>
                                            <button onClick={() => handleDelete(review._id)} className={styles.deleteButton}>Delete</button>
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