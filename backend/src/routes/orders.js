const { Hono } = require('hono');
const prisma = require('../services/database');
const { authMiddleware } = require('../middleware/auth');

const orders = new Hono();

// Get all orders
orders.get('/', authMiddleware, async (c) => {
  try {
    const { status, limit = 50, offset = 0 } = c.req.query();
    
    const where = status ? { status } : {};
    
    const orderList = await prisma.order.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await prisma.order.count({ where });
    
    return c.json({
      orders: orderList,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Create new order
orders.post('/', authMiddleware, async (c) => {
  try {
    const { customerName, customerEmail, itemsCount, priority = 'medium' } = await c.req.json();
    
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        itemsCount,
        priority,
        status: 'waiting'
      }
    });
    
    return c.json(order, 201);
  } catch (error) {
    console.error('Create order error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Update order status
orders.put('/:id/status', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const { status, packerId } = await c.req.json();
    
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    
    return c.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

module.exports = orders;
