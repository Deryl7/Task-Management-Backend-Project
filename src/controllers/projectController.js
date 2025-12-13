const prisma = require('../utils/client');
const { createProjectSchema } = require('../validators/projectValidator');

// CREATE PROJECT
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

// GET ALL PROJECTS (With Pagination & Search)
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

// UPDATE PROJECT
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // A. Validasi Input
    const validation = updateProjectSchema.safeParse(req.body);
    if (!validation.success) {
      const errorDetails = (validation.error.errors || []).map(err => ({
        field: err.path[0],
        message: err.message
      }));
      return res.status(400).json({ success: false, message: 'Validasi gagal', errors: errorDetails });
    }

    const { title, description } = validation.data;

    // B. Cek Keberadaan Project & Kepemilikan (PENTING!)
    const project = await prisma.project.findUnique({
      where: { id: Number(id) }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    // Cek apakah yang request adalah pemilik project?
    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Anda bukan pemilik project ini.' });
    }

    // C. Lakukan Update
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,       // Jika undefined (tidak dikirim), Prisma tidak akan mengupdatenya
        description
      }
    });

    res.status(200).json({
      success: true,
      message: 'Project berhasil diupdate',
      data: updatedProject
    });

  } catch (error) {
    next(error);
  }
};

// DELETE PROJECT
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // A. Cek Keberadaan & Kepemilikan
    const project = await prisma.project.findUnique({
      where: { id: Number(id) }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Anda bukan pemilik project ini.' });
    }

    // B. Lakukan Hapus
    await prisma.project.delete({
      where: { id: Number(id) }
    });

    // Return 204 No Content
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getAllProjects, updateProject, deleteProject };