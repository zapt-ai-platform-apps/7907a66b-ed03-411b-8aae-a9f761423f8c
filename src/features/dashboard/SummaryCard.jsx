import React from 'react';
import { Card } from '../../components/Card';
import { formatCurrency } from '../../utils/formatters';
import { Loading } from '../../components/Loading';
import { FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa';

export function SummaryCard({ summary, loading }) {
  if (loading) {
    return (
      <Card className="h-40 flex items-center justify-center">
        <Loading />
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-green-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <FaArrowUp className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Income</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.income)}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="bg-red-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-full">
            <FaArrowDown className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.expenses)}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className={summary.balance >= 0 ? "bg-blue-50" : "bg-orange-50"}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${summary.balance >= 0 ? "bg-blue-100" : "bg-orange-100"}`}>
            <FaBalanceScale className={summary.balance >= 0 ? "text-blue-600" : "text-orange-600"} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Balance</h3>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? "text-blue-600" : "text-orange-600"}`}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}