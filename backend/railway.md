# Railway Backend Configuration

## Build Command
npm run build

## Start Command  
npm start

## Environment Variables (Add these in Railway Dashboard)

NODE_ENV=production
JWT_SECRET=super-secret-jwt-key-change-this-in-production-very-long-string
JWT_EXPIRES_IN=7d

# Railway will automatically provide DATABASE_URL when you add PostgreSQL service
