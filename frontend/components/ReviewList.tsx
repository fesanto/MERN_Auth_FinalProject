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
    if (reviews.length === 0) {
        return <p>This book has no reviews yet. Be the first to write one!</p>;
    }

    return (
        <div>
            <h3>What do readers think?</h3>
            {reviews.map(review => (
                <div key={review._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
                    <strong>{review.user.name}</strong> - <span>{review.rating}/5 Stars</span>
                    <p>{review.comment}</p>
                    <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
            ))}
        </div>
    );
}