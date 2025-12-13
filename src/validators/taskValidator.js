const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1, "Judul tugas wajib diisi"),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(), // Default PENDING di database
  dueDate: z.string().datetime().optional(), // Format ISO string (YYYY-MM-DDTHH:mm:ssZ)
  projectId: z.number().int("Project ID harus berupa angka"),
  tagIds: z.array(z.number()).optional() // Array angka, opsional
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: z.string().datetime().optional()
});

module.exports = { createTaskSchema, updateTaskSchema };