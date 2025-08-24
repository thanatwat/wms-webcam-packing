const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create test users
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const packerPasswordHash = await bcrypt.hash('packer123', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  const packer1 = await prisma.user.upsert({
    where: { username: 'packer1' },
    update: {},
    create: {
      username: 'packer1',
      passwordHash: packerPasswordHash,
      role: 'packer',
    },
  });

  const packer2 = await prisma.user.upsert({
    where: { username: 'packer2' },
    update: {},
    create: {
      username: 'packer2',
      passwordHash: packerPasswordHash,
      role: 'packer',
    },
  });

  // Create test orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        itemsCount: 3,
        priority: 'high',
        status: 'waiting',
      },
    }),
    prisma.order.create({
      data: {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        itemsCount: 1,
        priority: 'medium',
        status: 'waiting',
      },
    }),
    prisma.order.create({
      data: {
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        itemsCount: 5,
        priority: 'low',
        status: 'waiting',
      },
    }),
    prisma.order.create({
      data: {
        customerName: 'Alice Brown',
        customerEmail: 'alice@example.com',
        itemsCount: 2,
        priority: 'high',
        status: 'in_progress',
      },
    }),
  ]);

  // Create test videos
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        jobId: 'JOB001',
        fileName: 'job-001-video.webm',
        driveFileId: 'fake-drive-id-1',
        shareableLink: 'https://drive.google.com/file/d/fake-drive-id-1/view',
        duration: 120,
        fileSize: 5242880, // 5MB
        uploadStatus: 'completed',
        packerId: packer1.id,
      },
    }),
    prisma.video.create({
      data: {
        jobId: 'JOB002',
        fileName: 'job-002-video.webm',
        driveFileId: 'fake-drive-id-2',
        shareableLink: 'https://drive.google.com/file/d/fake-drive-id-2/view',
        duration: 95,
        fileSize: 4194304, // 4MB
        uploadStatus: 'completed',
        packerId: packer2.id,
      },
    }),
    prisma.video.create({
      data: {
        jobId: 'JOB003',
        fileName: 'job-003-video.webm',
        driveFileId: 'fake-drive-id-3',
        shareableLink: 'https://drive.google.com/file/d/fake-drive-id-3/view',
        duration: 0,
        fileSize: 0,
        uploadStatus: 'uploading',
        packerId: packer1.id,
      },
    }),
  ]);

  console.log('Seeding finished.');
  console.log('Created users:', { admin, packer1, packer2 });
  console.log('Created orders:', orders.length);
  console.log('Created videos:', videos.length);
  console.log('\nLogin credentials:');
  console.log('Admin: admin / admin123');
  console.log('Packer1: packer1 / packer123');
  console.log('Packer2: packer2 / packer123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
