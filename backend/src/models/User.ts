import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },

    password: { 
        type: String, 
        required: true,
        select: false
    },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;