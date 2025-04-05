import { transactions } from '../drizzle/schema.js';
import { authenticateUser, getDatabaseConnection } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq, and, sum, gte, lte } from 'drizzle-orm';

export default async function handler(req, res) {
  console.log('Processing summary API request', req.query);
  
  try {
    const user = await authenticateUser(req);
    const db = getDatabaseConnection();
    const { startDate, endDate } = req.query;
    
    // Base query conditions
    let dateConditions = [];
    if (startDate) {
      console.log('Filtering from start date:', startDate);
      dateConditions.push(gte(transactions.date, new Date(startDate)));
    }
    if (endDate) {
      console.log('Filtering to end date:', endDate);
      dateConditions.push(lte(transactions.date, new Date(endDate)));
    }
    
    // Calculate total income
    const incomeResult = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(and(
        eq(transactions.userId, user.id),
        eq(transactions.type, 'income'),
        ...dateConditions
      ));
    
    // Calculate total expenses
    const expenseResult = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(and(
        eq(transactions.userId, user.id),
        eq(transactions.type, 'expense'),
        ...dateConditions
      ));
    
    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpenses = expenseResult[0]?.total || 0;
    const balance = totalIncome - totalExpenses;
    
    console.log('Summary results:', { income: totalIncome, expenses: totalExpenses, balance });
    
    return res.status(200).json({
      income: totalIncome,
      expenses: totalExpenses,
      balance: balance
    });
  } catch (error) {
    console.error('Error in summary API:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}