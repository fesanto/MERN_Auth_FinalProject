'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import styles from './book-details.module.css';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
            thumbnail: string;
        };
    };
}

interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function BookDetailsPage() {
    const params = useParams(); // Gets the parameters from the URL
    const bookId = params.bookId as string;

    // States for storing book data, review, logged in user, loading, and errors
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = useCallback(async () => { // avoid recreating the function on each render
        if (!bookId) return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews", err);
        }
    }, [bookId]);

    // useEffect to fetch data when the component loads
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // is the user logged in?
        setIsLoggedIn(!!token);

        if (!bookId) return;

        const fetchBookDetails = async () => {
            setIsLoading(true);
            setError('');
            try {
                const bookDetailsPromise = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}`);
                const reviewsPromise = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${bookId}`);

                const [bookDetailsResponse, reviewsResponse] = await Promise.all([bookDetailsPromise, reviewsPromise]);

                setBook(bookDetailsResponse.data);
                setReviews(reviewsResponse.data);
            } catch (err) {
                console.error('Error retrieving book details:', err);
                setError('The book details could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId, fetchReviews]); // The search is redone if the bookId changes

    const handleReviewDeleted = (deletedReviewId: string) => {
        setReviews(currentReviews => currentReviews.filter(review => review._id !== deletedReviewId));
    };

    const handleReviewUpdated = (updatedReview: Review) => {
        setReviews(currentReviews =>
            currentReviews.map(review => (review._id === updatedReview._id ? updatedReview : review))
        );
    };

    // Conditional rendering based on states
    if (isLoading) {
        return <div className={styles.loading}>Loading book details...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!book) {
        return <div className={styles.error}>Book not found.</div>;
    }

    // Rendering of book details
    const { title, authors, description, imageLinks } = book.volumeInfo;
    const imageUrl = imageLinks?.thumbnail || 'https://placehold.co/150x220?text=Sem+Capa';

    return (
        <div className={styles.container}>
            <section className={styles.bookInfo}>
                <Image
                    src={imageUrl.replace('http://', 'https://')}
                    alt={`Book cover ${title}`}
                    width={200}
                    height={300}
                    className={styles.coverImage}
                />
                <div className={styles.details}>
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.author}>por {authors?.join(', ') || 'Author Unknown'}</p>
                    <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: description || 'No description available' }}
                    />
                </div>
            </section>

            <hr className={styles.separator} />

            <section className={styles.reviewSection}>
                <h2>Readers' Reviews</h2>
                {isLoggedIn ? (
                    <ReviewForm bookId={bookId} onReviewSubmitted={fetchReviews} />
                ) : (
                    <p>You must be <a href="/login">logged in</a> to leave a review.</p>
                )}
                <ReviewList
                    reviews={reviews}
                    onReviewDeleted={handleReviewDeleted}
                    onReviewUpdated={handleReviewUpdated}
                />
            </section>
        </div >
    );
}