# QUICKSTART.md - 5 Minute Setup

Get your Smart Expense Tracker running in 5 minutes!

## 📋 What You Need

- Node.js 18+
- Python 3.11+
- (Optional) Docker for easier setup

## 🎯 Step 1: Get Free API Key (2 min)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up with email (no CC needed)
3. Create API key
4. Copy it

## 🔧 Step 2: Run Setup Script (1 min)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

## 🔑 Step 3: Add API Key (30 sec)

Edit `python-worker/.env`:
```
GROQ_API_KEY=your_key_here
```

## 🚀 Step 4: Start Services (2 min)

**Option A: Docker (Easiest)**
```bash
docker-compose up
```

**Option B: 3 Terminals**

Terminal 1:
```bash
cd backend && npm run dev
```

Terminal 2:
```bash
cd python-worker && python main.py
```

Terminal 3:
```bash
cd frontend && npm run dev
```

## ✨ Done!

Open [http://localhost:3000](http://localhost:3000) and start tracking expenses!

### Try:
1. Add manual expense
2. Upload a receipt photo
3. Check dashboard

**Need help?** See README.md or SETUP.md
