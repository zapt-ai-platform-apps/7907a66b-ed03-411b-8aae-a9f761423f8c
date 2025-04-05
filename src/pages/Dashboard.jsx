import React, { useState } from 'react';
import { SummaryCard } from '../features/dashboard/SummaryCard';
import { ExpenseChart, IncomeExpenseChart } from '../features/dashboard/ChartComponent';
import { TransactionList } from '../features/transactions/TransactionList';
import { useSummary } from '../hooks/useSummary';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaPlus } from 'react-icons/fa';
import { addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Modal } from '../components/Modal';
import { TransactionForm } from '../features/transactions/TransactionForm';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date())
  });
  
  const { summary, loading: summaryLoading } = useSummary(
    dateRange.startDate.toISOString(),
    dateRange.endDate.toISOString()
  );
  
  const { transactions, loading: transactionsLoading, deleteTransaction, addTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleQuickFilter = (months) => {
    const end = new Date();
    const start = addMonths(new Date(), months);
    
    setDateRange({
      startDate: start,
      endDate: end
    });
  };
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };
  
  const handleAddSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addTransaction(data);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      alert('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get recent transactions, limited to 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Add Transaction
          </Button>
        
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="text-xs" onClick={() => handleQuickFilter(-1)}>
              This Month
            </Button>
            <Button variant="secondary" className="text-xs" onClick={() => handleQuickFilter(-3)}>
              Last 3 Months
            </Button>
            <Button variant="secondary" className="text-xs" onClick={() => handleQuickFilter(-12)}>
              Year to Date
            </Button>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-300">
            <FaCalendar className="text-gray-500" />
            <DatePicker
              selected={dateRange.startDate}
              onChange={date => setDateRange(prev => ({ ...prev, startDate: date }))}
              className="w-24 border-none p-0 focus:outline-none box-border"
              dateFormat="MMM d, yyyy"
            />
            <span className="text-gray-500">to</span>
            <DatePicker
              selected={dateRange.endDate}
              onChange={date => setDateRange(prev => ({ ...prev, endDate: date }))}
              className="w-24 border-none p-0 focus:outline-none box-border"
              dateFormat="MMM d, yyyy"
            />
          </div>
        </div>
      </div>
      
      <SummaryCard summary={summary} loading={summaryLoading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart
          transactions={transactions}
          categories={categories}
          loading={transactionsLoading || categoriesLoading}
        />
        
        <IncomeExpenseChart
          transactions={transactions}
          loading={transactionsLoading}
        />
      </div>
      
      <Card title="Recent Transactions">
        <TransactionList
          transactions={recentTransactions}
          loading={transactionsLoading}
          onDelete={handleDeleteTransaction}
          categories={categories}
        />
        
        {recentTransactions.length > 0 && (
          <div className="mt-4 text-center">
            <Link to="/transactions">
              <Button variant="secondary" className="cursor-pointer">
                View All Transactions
              </Button>
            </Link>
          </div>
        )}
      </Card>
      
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={handleAddSubmit}
          categories={categories}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}