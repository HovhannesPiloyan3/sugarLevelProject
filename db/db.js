const sqlite3 = require('sqlite3').verbose();
const dbName = 'myapp.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
    const userTableSql = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        fullName TEXT,
        email TEXT,
        diabetesType TEXT
    )`;
    db.run(userTableSql);

    const sugarLevelTableSql = `
    CREATE TABLE IF NOT EXISTS sugar_levels (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        date TEXT,
        hours TEXT,  
        levels TEXT, 
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`;
    db.run(sugarLevelTableSql);

    const productSql = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        kk INTEGER,
        gi INTEGER,
        tags TEXT
    )`;
    db.run(productSql);
});

module.exports = db;
