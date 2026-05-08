import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{ type: String }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);