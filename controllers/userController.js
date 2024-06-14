const db = require('../db/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Добавление уровня сахара
exports.addSugarLevel = (req, res) => {
    const userId = req.user.id;
    const { date, hour, level } = req.body;

    // Проверка наличия всех обязательных полей
    if (!date || hour === undefined || !level) {
        return res.status(400).json({ error: "Date, hour, and level are required" });
    }

    // Проверка корректности значений
    if (level < 2 || level > 24) {
        return res.status(400).json({ error: "Level must be between 2 and 24" });
    }
    if (hour < 0 || hour > 23) {
        return res.status(400).json({ error: "Hour must be between 0 and 23" });
    }

    // Проверка наличия записи на указанную дату
    const selectSql = 'SELECT * FROM sugar_levels WHERE user_id = ? AND date = ?';
    db.get(selectSql, [userId, date], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            // Если запись существует, обновляем массивы hours и levels
            const hours = JSON.parse(row.hours);
            const levels = JSON.parse(row.levels);
            hours.push(hour);
            levels.push(level);
            const updateSql = 'UPDATE sugar_levels SET hours = ?, levels = ? WHERE id = ?';
            const updateParams = [JSON.stringify(hours), JSON.stringify(levels), row.id];
            db.run(updateSql, updateParams, function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: row.id, user_id: userId, date, hours, levels });
            });
        } else {
            // Если записи нет, создаем новую
            const hours = [hour];
            const levels = [level];
            const insertSql = 'INSERT INTO sugar_levels (user_id, date, hours, levels) VALUES (?, ?, ?, ?)';
            const insertParams = [userId, date, JSON.stringify(hours), JSON.stringify(levels)];
            db.run(insertSql, insertParams, function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID, user_id: userId, date, hours, levels });
            });
        }
    });
};

// Получение данных уровня сахара за день
exports.getDailySugarLevels = (req, res) => {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: "Date is required" });
    }

    const sql = 'SELECT hours, levels FROM sugar_levels WHERE user_id = ? AND date = ?';
    db.get(sql, [userId, date], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "No data found for this date" });
        }
        res.json({
            hours: JSON.parse(row.hours),
            levels: JSON.parse(row.levels)
        });
    });
};

exports.getDates = (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT DISTINCT date FROM sugar_levels WHERE user_id = ? ORDER BY date DESC';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const dates = rows.map(row => row.date);
        res.json(dates);
    });
};
// Обновление данных профиля пользователя
exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const { password, fullName, email, diabetesType } = req.body;

    // Проверка наличия хотя бы одного обновляемого поля
    if (!password && !fullName && !email && !diabetesType) {
        return res.status(400).json({ error: "At least one field to update is required" });
    }

    // Хеширование пароля, если он предоставлен
    if (password) {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            updateProfile(userId, { password: hashedPassword });
        });
    } else {
        updateProfile(userId, { fullName, email, diabetesType });
    }

    // Функция для обновления профиля в базе данных
    function updateProfile(userId, data) {
        const fieldsToUpdate = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const valuesToUpdate = Object.values(data);
        const sql = `UPDATE users SET ${fieldsToUpdate} WHERE id = ?`;
        const params = [...valuesToUpdate, userId];
        db.run(sql, params, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Profile updated successfully" });
        });
    }
};
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
