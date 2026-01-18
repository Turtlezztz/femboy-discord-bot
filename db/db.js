const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function dbConnect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database. Thread ID:', conn.threadId);
        conn.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

async function saveMessage(userId, userMessage, botMessage, location) {
    const sql = `
    INSERT INTO messages (discord_user_id, user_message, bot_message, location)
    VALUES (?, ?, ?, ?)
  `;
    try {
        const [result] = await pool.execute(sql, [userId, userMessage, botMessage, location]);
        console.log('Message saved with ID:', result.insertId);
        return result.insertId;
    } catch (err) {
        console.error('Error saving message to the database:', err);
        throw err;
    }
}

// Optional: gracefully close pool on shutdown
process.on('SIGINT', async () => {
    try {
        await pool.end();
    } finally {
        process.exit(0);
    }
});

module.exports = { dbConnect, saveMessage, pool };
