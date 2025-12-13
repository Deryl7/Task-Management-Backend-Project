const { z } = require('zod');

const createProjectSchema = z.object({
  title: z.string().min(1, "Judul project wajib diisi"),
  description: z.string().optional() // Boleh kosong
});

// Schema untuk update (title opsional)
const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional()
});

module.exports = { createProjectSchema, updateProjectSchema };