'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Book } from '@/types';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';

// interface for the reviews
interface IReview {
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function BookDetailsPage() {
    const params = useParams(); // Gets the parameters from the URL
    const bookId = params.bookId as string;

    // States for storing book data, review, logged in user, loading, and errors
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = useCallback(async () => { // avoid recreating the function on each render
        if (!bookId) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/${bookId}`);
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
                const bookDetailsPromise = axios.get(`http://localhost:5000/api/books/${bookId}`);
                const reviewsPromise = fetchReviews();

                const [bookDetailsResponse] = await Promise.all([bookDetailsPromise, reviewsPromise]);

                setBook(bookDetailsResponse.data);
            } catch (err) {
                console.error('Error retrieving book details:', err);
                setError('The book details could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId, fetchReviews]); // The search is redone if the bookId changes

    // Conditional rendering based on states
    if (isLoading) {
        return <div>Loading book details...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!book) {
        return <div>Book not found.</div>;
    }

    // Rendering of book details
    const { title, authors, description, imageLinks } = book.volumeInfo;
    const imageUrl = imageLinks?.thumbnail || 'https://placehold.co/150x220?text=Sem+Capa';

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Image
                    src={imageUrl.replace('http://', 'https://')}
                    alt={`Capa de ${title}`}
                    width={200}
                    height={300}
                    style={{ objectFit: 'contain' }}
                />
                <div>
                    <h1>{title}</h1>
                    <h2>por {authors?.join(', ') || 'Author Unknown'}</h2>
                    {description && (
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    )}
                </div>
            </div>

            <hr />

            <div style={{ marginTop: '2rem' }}>
                {isLoggedIn ? (
                    <ReviewForm bookId={bookId} onReviewSubmitted={fetchReviews} />
                ) : (
                    <p>You must be <a href="/login">logged in</a> to leave a review.</p>
                )}
                <ReviewList reviews={reviews} />
            </div>
        </div>
    );
}