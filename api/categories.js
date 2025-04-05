import { categories } from '../drizzle/schema.js';
import { authenticateUser, getDatabaseConnection } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Processing categories API request', req.method);
  
  try {
    const user = await authenticateUser(req);
    const db = getDatabaseConnection();
    
    if (req.method === 'GET') {
      console.log('Fetching categories for user:', user.id);
      // Get all categories for the user or default categories
      const result = await db.select()
        .from(categories)
        .where(eq(categories.userId, user.id));
      
      console.log('Fetched categories count:', result.length);
      return res.status(200).json(result);
    } 
    else if (req.method === 'POST') {
      console.log('Creating new category:', req.body);
      // Create a new category
      const { name, type } = req.body;
      
      const result = await db.insert(categories)
        .values({
          userId: user.id,
          name,
          type
        })
        .returning();
      
      console.log('Created category:', result[0]);
      return res.status(201).json(result[0]);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in categories API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}