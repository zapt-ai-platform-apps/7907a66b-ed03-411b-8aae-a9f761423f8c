import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function ExpenseChart({ transactions, categories, loading }) {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (transactions.length === 0 || categories.length === 0) {
      setChartData(null);
      return;
    }
    
    // Create a map of category IDs to names
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.name;
    });
    
    // Filter only expense transactions
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category and sum amounts
    const categoryTotals = {};
    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += parseFloat(transaction.amount);
    });
    
    // Generate chart data
    const labels = Object.keys(categoryTotals).map(id => categoryMap[id] || 'Unknown');
    const data = Object.values(categoryTotals);
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [transactions, categories]);
  
  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <Loading />
      </Card>
    );
  }
  
  if (!chartData) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <p className="text-gray-500">No expense data available for chart</p>
      </Card>
    );
  }
  
  return (
    <Card className="h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
      <div className="h-64">
        <Pie 
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </Card>
  );
}

export function IncomeExpenseChart({ transactions, loading }) {
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData(null);
      return;
    }
    
    // Group transactions by month and type
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[key].income += parseFloat(transaction.amount);
      } else {
        monthlyData[key].expense += parseFloat(transaction.amount);
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(`01 ${a}`);
      const dateB = new Date(`01 ${b}`);
      return dateA - dateB;
    });
    
    // Get the last 6 months
    const recentMonths = sortedMonths.slice(-6);
    
    const chartData = {
      labels: recentMonths,
      datasets: [
        {
          label: 'Income',
          data: recentMonths.map(month => monthlyData[month].income),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Expenses',
          data: recentMonths.map(month => monthlyData[month].expense),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
    
    setChartData(chartData);
  }, [transactions]);
  
  if (loading) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <Loading />
      </Card>
    );
  }
  
  if (!chartData || chartData.labels.length === 0) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <p className="text-gray-500">Not enough data for monthly comparison</p>
      </Card>
    );
  }
  
  return (
    <Card className="h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Comparison</h3>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </Card>
  );
}