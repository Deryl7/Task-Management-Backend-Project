const prisma = require('../utils/client');
const { createProjectSchema } = require('../validators/projectValidator');

// 1. CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const validation = createProjectSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.errors.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    const { title, description } = validation.data;
    
    // Ambil ID user dari Token (req.user diset oleh middleware auth)
    const userId = req.user.id;

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        userId // Hubungkan project dengan user yang sedang login
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project berhasil dibuat',
      data: newProject
    });

  } catch (error) {
    next(error);
  }
};

// 2. GET ALL PROJECTS (With Pagination & Search)
const getAllProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Ambil query params untuk pagination & search
    // Default: page 1, limit 10
    const { page = 1, limit = 10, search } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Filter Logic
    const whereClause = {
      userId: userId, // Pastikan user hanya melihat projectnya sendiri
    };

    // Jika ada search query, tambahkan filter title
    if (search) {
      whereClause.title = { contains: search }; // search case-sensitive di SQLite default, tapi cukup untuk demo
    }

    // Eksekusi Query (Transaction agar atomik: hitung total & ambil data)
    const [projects, totalRecords] = await prisma.$transaction([
      prisma.project.findMany({
        where: whereClause,
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
      }),
      prisma.project.count({ where: whereClause })
    ]);

    // Hitung total halaman
    const totalPages = Math.ceil(totalRecords / take);

    res.status(200).json({
      success: true,
      message: 'Daftar project berhasil diambil',
      data: projects,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalRecords,
        limit: Number(limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getAllProjects };