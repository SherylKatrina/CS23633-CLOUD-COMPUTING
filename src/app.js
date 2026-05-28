import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend running 🚀');
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

app.listen(process.env.PORT || 8080, () =>
  console.log('API running on port', process.env.PORT || 8080)
);