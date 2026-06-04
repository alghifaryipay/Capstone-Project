const db = require('../config/database'); // Sesuaikan path dengan file koneksi database kamu

// Mencari user berdasarkan email
const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0]; // Mengembalikan satu data user jika ada
};

// Menambahkan user baru ke database
const createUser = async (fullname, email, hashedPassword) => {
  const [result] = await db.query(
    'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
    [fullname, email, hashedPassword]
  );
  return result;
};

module.exports = {
  getUserByEmail,
  createUser
};