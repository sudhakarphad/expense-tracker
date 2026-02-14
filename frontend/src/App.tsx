import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { expenseService } from './services/api';
import { BarChart3 } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  description: string;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'add'>('dashboard');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await expenseService.getAll();
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const response = await expenseService.create(expenseData);
      setExpenses([...expenses, response.data]);
      setActiveTab('list');
      alert('Expense added successfully!');
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        setExpenses(expenses.filter(exp => exp.id !== id));
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Smart Expense Tracker</h1>
          </div>
          <p className="text-gray-600 mt-2">Track and analyze your expenses with AI-powered receipt scanning</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        ) : (
          <>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Expenses
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'add'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Add Expense
              </button>
            </div>

            {activeTab === 'dashboard' && <Dashboard expenses={expenses} />}
            {activeTab === 'list' && <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />}
            {activeTab === 'add' && <ExpenseForm onSubmit={handleAddExpense} />}
          </>
        )}
      </main>

      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Smart Expense Tracker • Powered by React, Node.js, Python & AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
