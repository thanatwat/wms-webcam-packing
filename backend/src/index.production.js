const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
require('dotenv').config();

const app = new Hono();

// CORS configuration for production
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}));

app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  await next();
});

// Routes
app.get('/', (c) => {
  return c.json({ 
    message: 'WMS Webcam Packing API Server',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.route('/api/auth', require('./routes/auth'));
app.route('/api/orders', require('./routes/orders'));
app.route('/api/videos', require('./routes/videos'));

const port = process.env.PORT || 3001;

console.log(`Server is running on port ${port}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

serve({
  fetch: app.fetch,
  port,
});
