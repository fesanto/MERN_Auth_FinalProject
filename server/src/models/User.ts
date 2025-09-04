import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    name: { 
        type: String, 
        required: [true, 'Please provide a name'], 
    },
    email: { 
        type: String, 
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true 
    },

    password: { 
        type: String, 
        required: [true, 'Please provide a password'],
        select: false
    },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;