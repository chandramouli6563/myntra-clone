import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview {
        user: mongoose.Types.ObjectId;
        rating: number;
        comment: string;
        createdAt: Date;
}

export interface IProduct extends Document {
        title: string;
        description: string;
        price: number;
        originalPrice?: number;
        discount?: number;
        images: string[];
        category: string;
        brand?: string;
        type?: string;
        rating?: number;
        stock?: number;
        sizes?: string[];
        colors?: string[];
        reviews?: IReview[];
}

const ReviewSchema = new Schema<IReview>(
        {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, min: 1, max: 5, required: true },
                comment: { type: String, default: '' },
                createdAt: { type: Date, default: Date.now },
        },
        { _id: false }
);

const ProductSchema = new Schema<IProduct>(
        {
                title: { type: String, required: true },
                description: { type: String, required: true },
                price: { type: Number, required: true },
                originalPrice: { type: Number },
                discount: { type: Number },
                images: { type: [String], default: [] },
                category: { type: String, required: true, index: true },
                brand: String,
                type: String,
                rating: { type: Number, default: 0 },
                stock: { type: Number, default: 100 },
                sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
                colors: { type: [String], default: ['Black', 'White', 'Blue', 'Red'] },
                reviews: { type: [ReviewSchema], default: [] },
        },
        { timestamps: true }
);

export const Product: Model<IProduct> =
        mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
