const { Hono } = require('hono');
const prisma = require('../services/database');
const { authMiddleware } = require('../middleware/auth');

const videos = new Hono();

// Get all videos
videos.get('/', authMiddleware, async (c) => {
  try {
    const { limit = 50, offset = 0 } = c.req.query();
    
    const videoList = await prisma.video.findMany({
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        packer: {
          select: { username: true }
        }
      },
      orderBy: { recordedAt: 'desc' }
    });
    
    const total = await prisma.video.count();
    
    return c.json({
      videos: videoList.map(video => ({
        ...video,
        packerName: video.packer.username
      })),
      total
    });
  } catch (error) {
    console.error('Get videos error:', error);
    return c.json({ error: 'Failed to fetch videos' }, 500);
  }
});

// Upload video metadata
videos.post('/upload', authMiddleware, async (c) => {
  try {
    const { jobId, fileName, driveFileId, shareableLink, duration, fileSize } = await c.req.json();
    const user = c.get('user');
    
    const video = await prisma.video.create({
      data: {
        jobId,
        fileName,
        driveFileId,
        shareableLink,
        duration,
        fileSize,
        packerId: user.id,
        uploadStatus: 'completed'
      }
    });
    
    return c.json(video, 201);
  } catch (error) {
    console.error('Upload video error:', error);
    return c.json({ error: 'Failed to save video metadata' }, 500);
  }
});

// Get video by ID
videos.get('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        packer: {
          select: { username: true }
        }
      }
    });
    
    if (!video) {
      return c.json({ error: 'Video not found' }, 404);
    }
    
    return c.json({
      ...video,
      packerName: video.packer.username
    });
  } catch (error) {
    console.error('Get video error:', error);
    return c.json({ error: 'Failed to fetch video' }, 500);
  }
});

module.exports = videos;
