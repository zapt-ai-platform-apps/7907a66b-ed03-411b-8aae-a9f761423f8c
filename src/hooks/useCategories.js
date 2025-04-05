import { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      console.log('Received categories:', data.length);
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (category) => {
    try {
      console.log('Adding category:', category);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      
      const newCategory = await response.json();
      console.log('Category added:', newCategory);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      Sentry.captureException(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
  };
}