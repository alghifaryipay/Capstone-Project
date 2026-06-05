const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { getUserByEmail, createUser } = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email sudah terdaftar!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email atau password salah!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "fail", message: "Email atau password salah!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullname: user.fullname },
      config.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      status: "success",
      message: "Login berhasil!",
      data: {
        token,
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

const getUserProfile = async (req, res) => {
  try {
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

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User tidak ditemukan di database." });
    }

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
