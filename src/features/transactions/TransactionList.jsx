import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function TransactionList({ transactions, loading, onEdit, onDelete, categories }) {
  if (loading) {
    return <Loading />;
  }
  
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="text-center p-8">
        <p className="text-gray-500">No transactions found. Add one to get started!</p>
      </Card>
    );
  }
  
  // Create a lookup map for categories
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category.id] = category.name;
  });
  
  return (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">
                {transaction.description || categoryMap[transaction.categoryId] || 'Unnamed Transaction'}
              </h4>
              <p className="text-sm text-gray-600">
                {categoryMap[transaction.categoryId]}
              </p>
              <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer"
                    aria-label="Edit transaction"
                  >
                    <FaEdit size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-1 text-gray-600 hover:text-red-600 cursor-pointer"
                    aria-label="Delete transaction"
                  >
                    <FaTrash size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}