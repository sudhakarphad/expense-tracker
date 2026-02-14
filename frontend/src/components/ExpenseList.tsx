import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  description: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-bold p-6 border-b">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="p-6 text-gray-500">No expenses yet. Add one to get started!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vendor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4">{expense.vendor || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{formatAmount(expense.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{expense.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
