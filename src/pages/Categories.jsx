import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../features/categories/CategoryForm';
import { Loading } from '../components/Loading';

export default function Categories() {
  const { categories, loading, addCategory } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await addCategory(formData);
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Failed to add category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Separate categories by type
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  
  if (loading) {
    return (
      <div className="p-4">
        <Loading />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Add New Category">
          <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Card>
        
        <div className="space-y-6">
          <Card title="Income Categories">
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500">No income categories found.</p>
            ) : (
              <div className="space-y-2">
                {incomeCategories.map(category => (
                  <div key={category.id} className="p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          <Card title="Expense Categories">
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500">No expense categories found.</p>
            ) : (
              <div className="space-y-2">
                {expenseCategories.map(category => (
                  <div key={category.id} className="p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}