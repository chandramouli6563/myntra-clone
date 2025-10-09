import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
        product: mongoose.Types.ObjectId;
        title: string;
        image?: string;
        quantity: number;
        price: number;
}

export interface IOrder extends Document {
        orderNumber: string;
        user: mongoose.Types.ObjectId;
        items: IOrderItem[];
        totalAmount: number;
        status: 'created' | 'paid' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
        deliveryDate?: Date;
        trackingStatus?: {
                stage: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
                message: string;
                updatedAt: Date;
        }[];
        cancellationReason?: string;
        rating?: {
                stars: number;
                review?: string;
                createdAt: Date;
        };
}

const OrderSchema = new Schema<IOrder>(
        {
                orderNumber: { type: String, unique: true, index: true },
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                items: [
                        {
                                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                                title: { type: String, required: true },
                                image: String,
                                quantity: { type: Number, required: true, min: 1 },
                                price: { type: Number, required: true },
                        },
                ],
                totalAmount: { type: Number, required: true },
                status: { 
                        type: String, 
                        enum: ['created', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'], 
                        default: 'created' 
                },
                razorpayOrderId: String,
                razorpayPaymentId: String,
                razorpaySignature: String,
                deliveryDate: Date,
                trackingStatus: [
                        {
                                stage: { 
                                        type: String, 
                                        enum: ['processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'] 
                                },
                                message: String,
                                updatedAt: { type: Date, default: Date.now },
                        }
                ],
                cancellationReason: String,
                rating: {
                        stars: { type: Number, min: 1, max: 5 },
                        review: String,
                        createdAt: { type: Date, default: Date.now },
                },
        },
        { timestamps: true }
);

export const Order: Model<IOrder> =
        mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
