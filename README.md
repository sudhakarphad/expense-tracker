# Smart Expense Tracker

A full-stack web application for tracking daily expenses with AI-powered receipt scanning. Built with React, Node.js, Python, and free LLM APIs. 100% card-free deployment ready.

## ✨ Features

- **Manual Entry**: Add expenses with category, vendor, date, and description
- **Smart Receipt Scanning**: Upload photos of receipts for automatic expense extraction
- **AI-Powered Parsing**: Uses Groq API (free tier) + EasyOCR to extract expense details
- **Dashboard**: Visual analytics with expense breakdown by category
- **Easy Expense Management**: View, edit, and delete expenses
- **Completely Free**: No credit card required for any service

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Vite)           │
│    • Dashboard • Form • Expense List    │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
┌────────────────▼────────────────────────┐
│      Node.js/Express Backend            │
│    • SQLite DB • Receipt Processing     │
└────────────────┬────────────────────────┘
                 │ API Call
┌────────────────▼────────────────────────┐
│    Python FastAPI Service               │
│    • EasyOCR • Groq LLM API             │
└─────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology | Free Option |
|-------|-----------|-------------|
| Frontend | React 18 + TypeScript + Vite | ✅ Vercel |
| Backend | Node.js + Express | ✅ Railway |
| Database | SQLite (local) / PostgreSQL | ✅ Railway free tier |
| OCR | Python + EasyOCR | ✅ Local/HF Spaces |
| LLM | Groq API (free tier) | ✅ 5000 req/day free |
| Hosting | Docker containers | ✅ Render/Railway |

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.11+
- Git
- Groq API key (free at [console.groq.com](https://console.groq.com))

## 🚀 Quick Start

### 1. Setup

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment

Edit `python-worker/.env` and add your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

### 3. Run Locally (with Docker Compose)

```bash
docker-compose up
```

This starts:
- Frontend on `http://localhost:3000`
- Backend API on `http://localhost:5000`
- Python worker on `http://localhost:8000`

### 4. Run Without Docker

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Python Worker**
```bash
cd python-worker
python main.py
```

**Terminal 3 - Frontend**
```bash
cd frontend
npm run dev
```

## 📚 API Routes

### Expenses

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `POST /api/expenses/process-receipt` - Upload & process receipt image
- `GET /api/expenses/stats` - Get spending statistics

## 💡 How Receipt Scanning Works

1. User uploads receipt photo
2. Frontend sends to backend as base64
3. Backend forwards to Python worker
4. Python worker uses EasyOCR to extract text
5. Text sent to Groq API for intelligent parsing
6. Extracted data returned and form is auto-filled
7. User reviews and submits

**Fallback**: If Groq API is down, uses rule-based parsing

## 🔒 Privacy & Security

- ✅ **No external data sharing** - receipts processed locally
- ✅ **Client-side encryption** ready (add as needed)
- ✅ **Single user mode** - no authentication needed for demo
- ✅ **No analytics** - just your data
- ✅ **Fully offline capable** - fallback parsing works without API

## 📦 Deployment

### Deploy Frontend (Vercel)

```bash
vercel deploy --prod
```

### Deploy Backend (Railway)

1. Push to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy with one click

### Deploy Python Worker (Render)

1. Create Render account
2. Connect GitHub repo
3. Set Python as runtime
4. Deploy as Web Service

## 🎯 Database Schema

```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  vendor TEXT,
  date TEXT NOT NULL,
  description TEXT,
  photoUrl TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🤖 Available Categories

- Food
- Transport
- Shopping
- Entertainment
- Utilities
- Other

## 📊 Dashboard Features

- Total spending
- Monthly breakdown
- Category-wise pie chart
- Trend analysis (future)

## 🧐 Troubleshooting

### Receipt scanning not working?
- Check Groq API key is set
- Verify Python worker is running
- Try with clearer receipt image
- Manual entry fallback always works

### CORS errors?
- Verify `CORS_ORIGIN` matches frontend URL
- Check backend is running on correct port

### Database errors?
- Delete `expenses.db` to reset
- Ensure SQLite3 is installed

## 📝 Project Structure

```
.
├── frontend/              # React Vite app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service
│   │   └── App.tsx       # Main component
│   └── package.json
├── backend/               # Node.js Express
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── db/           # Database setup
│   │   └── index.ts      # Server entry
│   └── package.json
├── python-worker/         # Python FastAPI
│   ├── main.py           # OCR + LLM service
│   └── requirements.txt
├── docker-compose.yml    # Multi-container orchestration
└── README.md
```

## 🚧 Future Features

- [ ] Category insights & budget alerts
- [ ] Recurring expenses
- [ ] Export to CSV/PDF
- [ ] Monthly reports
- [ ] Multi-user with auth
- [ ] Mobile app
- [ ] Invoice scanning
- [ ] Tax reporting helpers

## 📄 License

MIT - Feel free to use for portfolio

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and modify!

---

**Made with ❤️ for portfolio demonstration**

No credit card. No data tracking. Just your expenses, tracked smart.
