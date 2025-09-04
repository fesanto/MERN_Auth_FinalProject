import { Book } from '../types';
import BookCard from './BookCard';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
    results: Book[];
    isLoading: boolean;
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
    if (isLoading) {
        return <p>Searching...</p>;
    }

    if (results.length === 0) {
        return <p>No books found. Try a new search.</p>;
    }

    return (
        <div className={styles.grid}>
            {results.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}