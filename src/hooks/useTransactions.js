import { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching transactions...');
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      console.log('Received transactions:', data.length);
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transaction) => {
    try {
      console.log('Adding transaction:', transaction);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }
      
      const newTransaction = await response.json();
      console.log('Transaction added:', newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      console.error('Error adding transaction:', err);
      Sentry.captureException(err);
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (transaction) => {
    try {
      console.log('Updating transaction:', transaction);
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      
      const updatedTransaction = await response.json();
      console.log('Transaction updated:', updatedTransaction);
      setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
      return updatedTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      Sentry.captureException(err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      console.log('Deleting transaction:', id);
      const response = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      
      console.log('Transaction deleted');
      setTransactions(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      Sentry.captureException(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}