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
            href={`/book/${book.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={imageUrl}
                    alt={`Book cover ${title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                />
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.authors}>{authors}</p>
            </div>
        </Link>
    );
}