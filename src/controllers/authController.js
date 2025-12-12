const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../utils/client');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const register = async (req, res, next) => {
  try {
    // 1. Validasi Input menggunakan Zod
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      // Return 400 Bad Request jika validasi gagal [cite: 167]
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    const { name, email, password } = validation.data;

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Return 409 Conflict jika resource duplikat [cite: 171]
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // 3. Hash Password (Salt rounds min 10) 
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan User ke Database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' // Default role
      }
    });

    // 5. Response Sukses (201 Created) [cite: 165]
    // Jangan kembalikan password di response
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    next(error); // Lempar ke Error Handler global
  }
};

const login = async (req, res, next) => {
  try {
    // Validasi Input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    const { email, password } = validation.data;

    // Cari User berdasarkan Email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Validasi User & Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate Tokens
    const payload = {
      id: user.id,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN // e.g., '15m'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN // e.g., '7d'
    });

    // Response Sukses
    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,  // Token dikirim ke client
        refreshToken
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };