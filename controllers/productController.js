const db = require('../db/db');
const Product = require('../models/product');

exports.addProduct = (req, res) => {
    const { name, kk, gi, tags } = req.body;

    // Проверка наличия всех обязательных полей
    if (!name || !kk || !gi || !tags) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Добавление продукта в базу данных
    const sql = 'INSERT INTO products (name, kk, gi, tags) VALUES (?, ?, ?, ?)';
    const params = [name, kk, gi, tags];
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
};

exports.getProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.getProductById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(row);
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, kk, gi, tags } = req.body;

    // Проверка наличия хотя бы одного обновляемого поля
    if (!name && !kk && !gi && !tags) {
        return res.status(400).json({ error: "At least one field to update is required" });
    }

    const fieldsToUpdate = [];
    const params = [];

    if (name) {
        fieldsToUpdate.push('name = ?');
        params.push(name);
    }
    if (kk) {
        fieldsToUpdate.push('kk = ?');
        params.push(kk);
    }
    if (gi) {
        fieldsToUpdate.push('gi = ?');
        params.push(gi);
    }
    if (tags) {
        fieldsToUpdate.push('tags = ?');
        params.push(tags);
    }

    params.push(id);

    const sql = `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product updated successfully" });
    });
};

exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Product deleted successfully" });
    });
};
