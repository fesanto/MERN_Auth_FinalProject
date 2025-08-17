'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import Button from './Button';
import { Book } from '../types';

interface SearchBarProps {
    onSearchResults: (results: Book[]) => void;
    onSearchStart: () => void;
    onSearchEnd: () => void;
}

export default function SearchBar({ onSearchResults, onSearchStart, onSearchEnd }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        onSearchStart(); // search started

        try {
            const response = await axios.get(`http://localhost:5000/api/books/search?q=${query}`);
            // The Google API returns books within `response.data.items`
            onSearchResults(response.data.items || []);
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to retrieve books. Please try again.');
            onSearchResults([]); // Clears results in case of error
        } finally {
            onSearchEnd(); // search ended
        }
    };

    return (
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a book..."
                style={{ flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                required
            />
            <Button type="submit">Search</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}