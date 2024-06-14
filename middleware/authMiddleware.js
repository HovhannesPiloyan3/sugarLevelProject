const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Замените на ваш секретный ключ в реальном приложении

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};