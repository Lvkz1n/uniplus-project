#!/bin/sh
set -e

if [ "$RUN_DB_MIGRATIONS" = "true" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy
fi

echo "Starting server..."
node src/server.js
