#!/bin/bash

# Check if DATABASE_URL exists
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "Running database migration..."
npx prisma db push --accept-data-loss

echo "Seeding database..."
npm run seed

echo "Starting server..."
npm start
