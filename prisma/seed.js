const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Bersihkan database
  await prisma.taskTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // 2. Persiapan Password Hash
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 3. Buat Users (1 Admin, 2 Regular User)
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@test.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Deryl',
      email: 'deryl@test.com',
      password: passwordHash,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Agam',
      email: 'agam@test.com',
      password: passwordHash,
      role: 'USER',
    },
  });

  // 4. Buat Tags
  const tagUrgent = await prisma.tag.create({ data: { name: 'Urgent' } });
  const tagBug = await prisma.tag.create({ data: { name: 'Bug' } });
  const tagFeature = await prisma.tag.create({ data: { name: 'Feature' } });
  const tagDocs = await prisma.tag.create({ data: { name: 'Documentation' } });

  // 5. Buat Projects & Tasks untuk user1 (Deryl)
  const project1 = await prisma.project.create({
    data: {
      title: 'Aplikasi E-Commerce',
      description: 'Project akhir semester pemrograman web',
      userId: user1.id,
      tasks: {
        create: [
          {
            title: 'Desain Database',
            status: 'DONE',
            tags: {
              create: [
                { tag: { connect: { id: tagDocs.id } } }
              ]
            }
          },
          {
            title: 'Setup Server',
            status: 'IN_PROGRESS',
            tags: {
              create: [
                { tag: { connect: { id: tagFeature.id } } }
              ]
            }
          },
          {
            title: 'Fix Login Bug',
            status: 'PENDING',
            tags: {
              create: [
                { tag: { connect: { id: tagUrgent.id } } },
                { tag: { connect: { id: tagBug.id } } }
              ]
            }
          }
        ]
      }
    }
  });

  // 6. Buat Projects untuk user2 (Agam)
  await prisma.project.create({
    data: {
      title: 'Sistem Absensi',
      description: 'Project internal kantor',
      userId: user2.id,
      tasks: {
        create: [
          {
            title: 'Buat UI Mockup',
            status: 'DONE',
             tags: {
              create: [
                { tag: { connect: { id: tagDocs.id } } }
              ]
            }
          },
          {
            title: 'Implementasi API',
            status: 'PENDING',
             tags: {
              create: [
                { tag: { connect: { id: tagFeature.id } } },
                { tag: { connect: { id: tagUrgent.id } } }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });