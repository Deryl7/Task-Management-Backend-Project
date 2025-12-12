const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 1. Ambil header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan.'
    });
  }

  // 2. Format harus "Bearer <token>"
  // Pisahkan string untuk mengambil tokennya saja
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Format token salah. Gunakan: Bearer <token>'
    });
  }

  try {
    // 3. Verifikasi Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Simpan data user ke dalam object Request (req)
    // Agar bisa dipakai di controller selanjutnya
    req.user = decoded;

    next(); // Lanjut ke controller berikutnya
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa.'
    });
  }
};

module.exports = { authenticate };