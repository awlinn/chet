const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;
const crypto = require("crypto");

const dbFile = "./chat.db";
const exists = fs.existsSync(dbFile);

dbWrapper.open({
    filename: dbFile,
    driver: sqlite3.Database
}).then(async dBase => {
    db = dBase;
    try {
        if (!exists) {
            await db.run(`
              CREATE TABLE user (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                password TEXT
              )`);

            await db.run(`INSERT INTO user (login, password) VALUES ('admin', 'admin')`);

            await db.run(`
            CREATE TABLE message (
              message_id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER, 
              content TEXT,
              FOREIGN KEY (user_id) REFERENCES user(user_id)
            )`);
            console.log(await db.all("SELECT * from user"),"new db");
        } else {
            console.log('server started');
        }
    } catch (dbError) {
        console.error(dbError);
    }
});

module.exports = {
    getMessages: async () => {
        try {
            return await db.all(`
              SELECT message_id, content, login, user_id
              FROM message
              JOIN user ON message.user_id = user.user_id
            `);
        } catch (dbError) {
            console.error(dbError);
        }
    },
    addMessage: async (msg, userId) => {
        await db.run(`INSERT INTO message (content, user_id) VALUES (?, ?)`, [msg, userId]);
    },
    authenticateUser: async (login, password) => {
        try {
            const user = await db.all('SELECT * FROM user WHERE login = ? AND password = ?', [login, password]);
            if (user.length == 0) {
                return { isAuthenticated: false, user: null };
            } else {
                return { isAuthenticated: true, user: user[0] };
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            return { isAuthenticated: false, user: null };
        }
    },
    authenticateUserName: async (login) => {
        try {
            const user = await db.all('SELECT * FROM user WHERE login = ?', [login]);
            if (user.length == 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            return { isAuthenticatedName: false, user: null };
        }
    },

    registerUser: async (login, password) => {
        try {
            const result = await db.run(`
                INSERT INTO user (login, password)
                VALUES (?, ?)`, [login, password]
            );
            console.log(await db.all("SELECT * from user"));
            return result.lastID;
        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;
        }
    },
    getAuthToken: async (user) => {
        
        const candidate = await db.all('SELECT * FROM user WHERE login = ?', [user.login]);
        if (!candidate.length) {
            throw 'Wrong login';
        }
        if (candidate[0].password !== user.password) {
            throw 'Wrong password';
        }
        return candidate[0].user_id + '.' + user.login + '.' + crypto.randomBytes(20).toString('hex');
    }
};