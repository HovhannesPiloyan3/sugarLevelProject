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
    origin: 'https://cy40407.tw1.ru', // Разрешить только с этого источника
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешить только эти методы
    allowedHeaders: ['Content-Type', 'Authorization'] // Разрешить только эти заголовки
}));

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});