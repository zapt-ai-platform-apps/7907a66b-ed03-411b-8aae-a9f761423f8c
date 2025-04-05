import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function TransactionForm({ onSubmit, initialData = null, categories, isSubmitting }) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    categoryId: initialData?.categoryId || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount || '',
        categoryId: initialData.categoryId || '',
        description: initialData.description || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };
  
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      type,
      categoryId: '', // Reset category when type changes
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form
    if (!formData.amount || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Convert amount to number
    const formattedData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    
    // If editing, include the ID
    if (initialData?.id) {
      formattedData.id = initialData.id;
    }
    
    onSubmit(formattedData);
  };
  
  // Filter categories based on selected type
  const filteredCategories = categories
    .filter(cat => cat.type === formData.type)
    .map(cat => ({ value: cat.id, label: cat.name }));
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleTypeChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Income</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleTypeChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">Expense</span>
          </label>
        </div>
      </div>
      
      <Input
        label="Amount"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <Select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          options={filteredCategories}
          placeholder={`Select a ${formData.type} category`}
          required
        />
      </div>
      
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 box-border"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {initialData ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
}