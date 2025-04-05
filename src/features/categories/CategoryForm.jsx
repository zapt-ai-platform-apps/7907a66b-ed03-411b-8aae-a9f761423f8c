import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function CategoryForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a category name');
      return;
    }
    
    onSubmit(formData);
    setFormData({ name: '', type: 'expense' });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter category name"
        required
      />
      
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
      
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
        Add Category
      </Button>
    </form>
  );
}