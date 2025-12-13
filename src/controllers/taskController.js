const prisma = require('../utils/client');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

// 1. CREATE TASK
const createTask = async (req, res, next) => {
  try {
    const validation = createTaskSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.errors.map(err => ({ field: err.path[0], message: err.message }))
      });
    }

    const { title, description, status, dueDate, projectId, tagIds } = validation.data;
    const userId = req.user.id;

    // A. Validasi: Pastikan Project ada DAN milik User yang sedang login
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project tidak ditemukan' });
    }

    if (project.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki akses ke project ini' });
    }

    // B. Buat Task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null, // Konversi string ke Date Object
        projectId,
        // Logika relasi many-to-many
        tags: {
            create: tagIds && tagIds.length > 0 ? tagIds.map(tagId => ({
                tag: { connect: { id: tagId } }
            })) : []
        }
      },
    //   Include tags di response
        include: {
            tags: {
                include: {
                    tag: true // Tampilkan data tag lengkap
                }
            }
        }
    });

    res.status(201).json({
      success: true,
      message: 'Task berhasil dibuat',
      data: newTask
    });

  } catch (error) {
    next(error);
  }
};

// 2. GET TASKS (Bisa filter by Project)
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query; // Filter opsional: ?projectId=1

    // Base filter: Task harus berada di project milik user
    const whereClause = {
      project: {
        userId: userId
      }
    };

    // Jika ada filter projectId spesifik
    if (projectId) {
      whereClause.projectId = Number(projectId);
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      message: 'Daftar task berhasil diambil',
      data: tasks
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks };