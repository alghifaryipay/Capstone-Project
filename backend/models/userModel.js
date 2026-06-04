const db = require('../config/database'); // Sesuaikan path dengan file koneksi database kamu
const localStore = require('../services/localStore');

const warnFallback = (operation, error) => {
  console.warn(
    `Database ${operation} gagal, memakai local JSON store: ${error.message}`
  );
};

// Mencari user berdasarkan email
const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; // Mengembalikan satu data user jika ada
  } catch (error) {
    warnFallback('getUserByEmail', error);
    return localStore.findUserByEmail(email);
  }
};

// Menambahkan user baru ke database
const createUser = async (fullname, email, hashedPassword) => {
  try {
    const [result] = await db.query(
      'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
      [fullname, email, hashedPassword]
    );
    return result;
  } catch (error) {
    warnFallback('createUser', error);
    return { insertId: await localStore.insertUser(fullname, email, hashedPassword) };
  }
};

module.exports = {
  getUserByEmail,
  createUser
};
