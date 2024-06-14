const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 5000;

// Настройка CORS
app.use(cors({
    origin: '*', // Разрешить все источники
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешить эти методы
    allowedHeaders: ['Content-Type', 'Authorization','ngrok-skip-browser-warning'] // Разрешить эти заголовки
}));

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});