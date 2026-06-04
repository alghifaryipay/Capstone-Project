const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail, createUser } = require("../models/userModel");

// --- FITUR REGISTER ---
const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email sudah terdaftar!" });
    }

    // 2. Hash/Acak password agar aman di database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Simpan ke database
    await createUser(fullname, email, hashedPassword);

    res.status(201).json({
      status: "success",
      message: "Registrasi berhasil! Silakan login.",
    });
  } catch (error) {
    console.error("Error saat register:", error);
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// --- FITUR LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email atau password salah!" });
    }

    // 2. Cocokkan password yang diketik dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email atau password salah!" });
    }

    // 3. Buat Token JWT (Token ini akan dipakai frontend untuk mengenali user)
    // Pastikan kamu punya JWT_SECRET di file .env kamu (misal: JWT_SECRET=rahasia_negara)
    const token = jwt.sign(
      { id: user.id, email: user.email, fullname: user.fullname },
      process.env.JWT_SECRET || "secret_key_sementara",
      { expiresIn: "24h" }, // Token berlaku 24 jam
    );

    res.status(200).json({
      status: "success",
      message: "Login berhasil!",
      data: {
        token: token,
        user: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res
      .status(500)
      .json({ status: "error", message: "Terjadi kesalahan pada server." });
  }
};

// Pastikan kamu meng-import jwt jika belum ada di file ini
// const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  try {
    // 1. Ambil token dari header Authorization (Format yang dikirim frontend: "Bearer token123...")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          status: "fail",
          message: "Akses ditolak. Token tidak ditemukan.",
        });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verifikasi token (Pastikan 'secret_key' sama persis dengan yang ada di fungsi login)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key_sementara",
    );

    // 3. Cari user di MySQL berdasarkan email dari token yang dibongkar
    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User tidak ditemukan di database." });
    }

    // 4. Kembalikan data aslinya langsung dari MySQL (TIDAK TERMASUK PASSWORD)
    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error verifikasi token:", error);
    res
      .status(401)
      .json({
        status: "fail",
        message: "Sesi tidak valid atau telah berakhir. Silakan login ulang.",
      });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
};
