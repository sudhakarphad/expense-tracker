import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  processReceipt,
  getStats,
} from '../controllers/expenseController.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router.get('/expenses', getAllExpenses);
router.get('/expenses/stats', getStats);
router.post('/expenses', createExpense);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);
router.post('/expenses/process-receipt', upload.single('file'), processReceipt);

export default router;
