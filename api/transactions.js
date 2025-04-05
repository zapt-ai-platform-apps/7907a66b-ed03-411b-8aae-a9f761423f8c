import { transactions } from '../drizzle/schema.js';
import { authenticateUser, getDatabaseConnection } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq, and, desc } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Processing transactions API request', req.method);
  
  try {
    const user = await authenticateUser(req);
    const db = getDatabaseConnection();
    
    if (req.method === 'GET') {
      console.log('Fetching transactions for user:', user.id);
      // Get all transactions for the user
      const result = await db.select()
        .from(transactions)
        .where(eq(transactions.userId, user.id))
        .orderBy(desc(transactions.date));
      
      console.log('Fetched transactions count:', result.length);
      return res.status(200).json(result);
    } 
    else if (req.method === 'POST') {
      console.log('Creating new transaction:', req.body);
      // Create a new transaction
      const { amount, type, categoryId, description, date } = req.body;
      
      const result = await db.insert(transactions)
        .values({
          userId: user.id,
          amount,
          type,
          categoryId,
          description,
          date: date ? new Date(date) : new Date()
        })
        .returning();
      
      console.log('Created transaction:', result[0]);
      return res.status(201).json(result[0]);
    }
    else if (req.method === 'PUT') {
      console.log('Updating transaction:', req.body);
      // Update an existing transaction
      const { id, amount, type, categoryId, description, date } = req.body;
      
      const result = await db.update(transactions)
        .set({
          amount,
          type,
          categoryId,
          description,
          date: date ? new Date(date) : new Date()
        })
        .where(and(
          eq(transactions.id, id),
          eq(transactions.userId, user.id)
        ))
        .returning();
      
      if (result.length === 0) {
        console.log('Transaction not found for update');
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      console.log('Updated transaction:', result[0]);
      return res.status(200).json(result[0]);
    }
    else if (req.method === 'DELETE') {
      console.log('Deleting transaction:', req.body);
      // Delete a transaction
      const { id } = req.body;
      
      const result = await db.delete(transactions)
        .where(and(
          eq(transactions.id, id),
          eq(transactions.userId, user.id)
        ))
        .returning();
      
      if (result.length === 0) {
        console.log('Transaction not found for deletion');
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      console.log('Deleted transaction:', result[0]);
      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in transactions API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}