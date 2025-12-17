const prisma = require('../config/database');
const { z } = require('zod');

// Schema validasi simple
const createTagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi")
});

const createTag = async (req, res, next) => {
  try {
    const validation = createTagSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, message: 'Validasi gagal' });
    }

    const { name } = validation.data;

    const newTag = await prisma.tag.create({
      data: { name }
    });

    res.status(201).json({
      success: true,
      message: 'Tag berhasil dibuat',
      data: newTag
    });
  } catch (error) {
    next(error);
  }
};

const getAllTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTag, getAllTags };