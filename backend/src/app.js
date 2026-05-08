import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import { fileURLToPath } from 'url';
import path from 'path'

const app = express();

app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;