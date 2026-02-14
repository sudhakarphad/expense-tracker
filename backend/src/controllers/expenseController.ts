import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { allAsync, getAsync, runAsync } from '../db/database.js';
import axios from 'axios';
import fs from 'fs';

export async function getAllExpenses(_req: Request, res: Response) {
  try {
    const expenses = await allAsync('SELECT * FROM expenses ORDER BY date DESC');
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const { amount, category, vendor, date, description, photoUrl } = req.body;
    
    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await runAsync(
      'INSERT INTO expenses (id, amount, category, vendor, date, description, photoUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, amount, category, vendor || '', date, description || '', photoUrl || '', createdAt]
    );

    const expense = await getAsync('SELECT * FROM expenses WHERE id = ?', [id]);
    return res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { amount, category, vendor, date, description, photoUrl } = req.body;

    await runAsync(
      'UPDATE expenses SET amount = ?, category = ?, vendor = ?, date = ?, description = ?, photoUrl = ? WHERE id = ?',
      [amount, category, vendor || '', date, description || '', photoUrl || '', id]
    );

    const expense = await getAsync('SELECT * FROM expenses WHERE id = ?', [id]);
    return res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await runAsync('DELETE FROM expenses WHERE id = ?', [id]);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
}

export async function processReceipt(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000';
    
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString('base64');

    const response = await axios.post(
      `${pythonWorkerUrl}/process-receipt`,
      { image: base64Image, filename: req.file.originalname },
      { timeout: 30000 }
    );

    fs.unlinkSync(req.file.path);

    const expense = response.data;
    
    res.json({
      amount: expense.amount,
      category: expense.category,
      vendor: expense.vendor || '',
      description: expense.description || 'Auto-detected from receipt',
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error: any) {
    console.error('Error processing receipt:', error.message);
    
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    }

    res.status(500).json({ 
      error: 'Failed to process receipt. Please try again or enter manually.' 
    });
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const expenses = await allAsync('SELECT * FROM expenses');
    
    const total = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const now = new Date();
    const currentMonth = expenses.filter((exp: any) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });

    const monthlyTotal = currentMonth.reduce((sum: number, exp: any) => sum + exp.amount, 0);

    res.json({
      total,
      monthlyTotal,
      byCategory,
      expenseCount: expenses.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
