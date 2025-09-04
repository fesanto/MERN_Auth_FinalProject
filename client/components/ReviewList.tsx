import styles from './ReviewList.module.css';

interface Review {
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
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
                        <div>
                            <p className={styles.comment}>{review.comment}</p>
                            <p className={styles.date}>
                                Posted on {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}