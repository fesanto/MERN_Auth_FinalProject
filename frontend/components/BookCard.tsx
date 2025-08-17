import Link from 'next/link';
import Image from 'next/image'; 
import { Book } from '../types';
import styles from './BookCard.module.css'; 

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    const title = book.volumeInfo.title;
    const authors = book.volumeInfo.authors?.join(', ') || 'Author unknown';
    const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 'https://placehold.co/128x192?text=Sem+Capa';

    return (
        <Link
            href={`/book/${book.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
        >
            <Image
                src={imageUrl}
                alt={`Capa do livro ${title}`}
                width={128}
                height={192}
                style={{ objectFit: 'cover' }}
            />
            <div className={styles.cardContent}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.authors}>{authors}</p>
            </div>
        </Link>
    );
}