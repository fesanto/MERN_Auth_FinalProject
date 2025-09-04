import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    googleBooksId: string;
}

const BookSchema: Schema = new Schema({
    googleBooksId: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model<IBook>('Book', BookSchema);