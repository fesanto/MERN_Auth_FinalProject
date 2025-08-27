'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { Book } from '@/types';

export default function DashboardPage() {
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div>
            <h1>My Dashboard</h1>
            <p>Welcome! Here you can search for your books and leave your reviews.</p>

            <SearchBar
                onSearchResults={(results) => {
                    setSearchResults(results);
                    setHasSearched(true); // the first search was performed
                }}
                onSearchStart={() => setIsLoading(true)}
                onSearchEnd={() => setIsLoading(false)}
            />

            {/* Only displays the results area if a search has already been initiated. */}
            {hasSearched && <SearchResults results={searchResults} isLoading={isLoading} />}
        </div>
    )
}
