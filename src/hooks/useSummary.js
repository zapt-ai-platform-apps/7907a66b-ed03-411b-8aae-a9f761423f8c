import { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

export function useSummary(startDate, endDate) {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching summary data...');
      let url = '/api/summary';
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('startDate', startDate);
        console.log('Using start date:', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
        console.log('Using end date:', endDate);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      const data = await response.json();
      console.log('Summary data received:', data);
      setSummary(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refreshSummary: fetchSummary,
  };
}