import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
        name: string;
        email: string;
        password?: string;
        phone?: string;
        addresses: { line1: string; line2?: string; city: string; state: string; zip: string; phone?: string }[];
        paymentMethods: { type: string; last4: string; brand?: string; expiryMonth?: number; expiryYear?: number; upiId?: string }[];
        comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
        {
                name: { type: String, required: true },
                email: { type: String, required: true, unique: true, index: true },
                password: { type: String, select: false },
                phone: { type: String, unique: true, sparse: true },
                addresses: [
                        {
                                line1: String,
                                line2: String,
                                city: String,
                                state: String,
                                zip: String,
                                phone: String,
                        },
                ],
                paymentMethods: [
                        {
                                type: { type: String, enum: ['card', 'upi', 'netbanking'], default: 'card' },
                                last4: String,
                                brand: String,
                                expiryMonth: Number,
                                expiryYear: Number,
                                upiId: String,
                        },
                ],
        },
        { timestamps: true }
);

UserSchema.pre('save', async function (next) {
        const user = this as IUser;
        if (!user.password || !user.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
        return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
        mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
