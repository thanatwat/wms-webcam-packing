const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
require('dotenv').config();

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Routes
app.get('/', (c) => {
  return c.json({ message: 'WMS Webcam Packing API Server' });
});

app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes will be added here
app.route('/api/auth', require('./routes/auth'));
app.route('/api/orders', require('./routes/orders'));
app.route('/api/videos', require('./routes/videos'));

const port = process.env.PORT || 3001;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
