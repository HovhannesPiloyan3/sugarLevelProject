const bcrypt = require('bcrypt');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secretKey = 'your_secret_key'; // Замените на ваш секретный ключ в реальном приложении

// Регистрация пользователя
exports.registerUser = (req, res) => {
    const { username, password, fullName, email, diabetesType } = req.body;

    // Проверка наличия всех обязательных полей
    if (!username || !password || !fullName || !email || !diabetesType) {
        return res.status(400).json({ error: "Все поля обязательны для заполнения" });
    }

    // Проверка длины пароля
    if (password.length < 8) {
        return res.status(400).json({ error: "Пароль не должен быть короче 8 символов" });
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Неправилный формат email" });
    }

    // Хеширование пароля и вставка пользователя в базу данных
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const sql = 'INSERT INTO users (username, password, fullName, email, diabetesType) VALUES (?, ?, ?, ?, ?)';
        const params = [username, hashedPassword, fullName, email, diabetesType];
        db.run(sql, params, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        });
    });
};

// Авторизация пользователя
exports.loginUser = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Неверное имя пользователя и пароль' });
        }
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result) {
                const token = jwt.sign({ id: row.id, username: row.username }, secretKey, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ error: 'Неверное имя пользователя и пароль' });
            }
        });
    });
};

// Получение данных пользователя
exports.getUserProfile = (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT id, username, fullName, email, diabetesType FROM users WHERE id = ?';
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
};