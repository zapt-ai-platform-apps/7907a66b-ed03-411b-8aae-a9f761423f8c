import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TransactionList } from '../features/transactions/TransactionList';
import { TransactionForm } from '../features/transactions/TransactionForm';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { Modal } from '../components/Modal';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { Select } from '../components/Select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Transactions() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    startDate: null,
    endDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };
  
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditModal(true);
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
  
  const handleEditSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateTransaction(data);
      setShowEditModal(false);
      setCurrentTransaction(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      alert('Failed to update transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };
  
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      type: '',
      categoryId: '',
      startDate: null,
      endDate: null,
    });
  };
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Type filter
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }
    
    // Category filter
    if (filters.categoryId && transaction.categoryId !== parseInt(filters.categoryId)) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(transaction.date) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && new Date(transaction.date) > filters.endDate) {
      return false;
    }
    
    return true;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center cursor-pointer"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          <Button onClick={handleAddClick} className="flex items-center cursor-pointer">
            <FaPlus className="mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card title="Filters">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                options={[
                  { value: 'income', label: 'Income' },
                  { value: 'expense', label: 'Expense' }
                ]}
                placeholder="All Types"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                options={categoryOptions}
                placeholder="All Categories"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 box-border"
                placeholderText="Start date"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 box-border"
                placeholderText="End date"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={handleClearFilters} className="cursor-pointer">
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
      
      <TransactionList
        transactions={sortedTransactions}
        loading={loading || categoriesLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteTransaction}
        categories={categories}
      />
      
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
      
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentTransaction(null);
        }}
        title="Edit Transaction"
      >
        <TransactionForm
          onSubmit={handleEditSubmit}
          initialData={currentTransaction}
          categories={categories}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}