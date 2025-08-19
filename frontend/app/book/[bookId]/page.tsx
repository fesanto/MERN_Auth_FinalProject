'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Book } from '@/types';

export default function BookDetailsPage() {
    const params = useParams(); // Gets the parameters from the URL
    const bookId = params.bookId;

    // States for storing book data, loading, and errors
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect to fetch data when the component loads
    useEffect(() => {
        if (!bookId) return; 

        const fetchBookDetails = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
                setBook(response.data);
            } catch (err) {
                console.error('Error retrieving book details:', err);
                setError('The book details could not be loaded.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookId]); // The search is redone if the bookId changes

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
        </div>
    );
}