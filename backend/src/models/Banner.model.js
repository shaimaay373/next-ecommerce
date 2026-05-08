import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Banner', BannerSchema);