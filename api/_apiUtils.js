import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export function getDatabaseConnection() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  return drizzle(client);
}

export async function authenticateUser(req) {
  try {
    // In a real app, we would verify the user's credentials
    // For now, we'll just return a dummy user
    return {
      id: "00000000-0000-0000-0000-000000000000",
      email: "user@example.com"
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}