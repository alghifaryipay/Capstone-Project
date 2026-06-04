const db = require("../config/database");

const getUserByEmail = async (email) => {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);
};

const createUser = async (fullname, email, hashedPassword) => {
  const result = db
    .prepare(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)"
    )
    .run(fullname, email, hashedPassword);

  return {
    insertId: Number(result.lastInsertRowid),
  };
};

module.exports = {
  getUserByEmail,
  createUser,
};
