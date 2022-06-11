const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: "qazplmwsx",
        database: 'company'
    },
    console.log('Connected to the company database.')
);

module.exports = db;