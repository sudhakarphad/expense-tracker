import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { expenseService } from '../services/api';

interface ExpenseFormProps {
  onSubmit: (expense: any) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await expenseService.processReceipt(file);
      setFormData(prev => ({ 
        ...prev, 
        ...response.data,
        date: response.data.date || prev.date
      }));
    } catch (error) {
      console.error('Failed to process receipt:', error);
      alert('Failed to process receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Expense</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Receipt (Optional)</label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={loading}
            className="hidden"
            id="photo-input"
          />
          <label htmlFor="photo-input" className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
            <Camera size={20} />
            {loading ? 'Processing...' : 'Take Photo'}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Utilities</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Vendor/Shop</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g., Starbucks"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          rows={2}
          placeholder="Notes about this expense"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        <Plus size={20} />
        Add Expense
      </button>
    </form>
  );
};
