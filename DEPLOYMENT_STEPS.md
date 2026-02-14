# 🚀 Smart Expense Tracker - Online Deployment Guide

**Your app is running locally! Now let's deploy it ONLINE with 3 free services.**

> ⏱️ **Time needed**: ~30 minutes  
> 💳 **Cost**: FREE (no credit card required anywhere!)  
> ✅ **Services**: Vercel (Frontend) + Railway (Backend) + optional Render (Python)

---

## 🎯 What You'll Get

After completing this guide:
- ✅ **Frontend** deployed and live on Vercel
- ✅ **Backend API** running on Railway  
- ✅ **Custom domain** (optional): https://yourapp.vercel.app
- ✅ **Auto-deploys** whenever you push to GitHub

---

## 📋 Prerequisites

Before starting, have these ready:
- [ ] GitHub account (free at github.com)
- [ ] Vercel account (or signin with GitHub)
- [ ] Railway account (or signin with GitHub)
- [ ] Groq API key (get free at console.groq.com - no CC!)
- [ ] Git installed on your computer

---

## ✅ STEP 1: Initialize Git & Push to GitHub

### 1.1 Initialize Git (if not already done)

Open terminal in project root and run:

```bash
cd "C:\Users\sudha\expense tracker"
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 1.2 Add all files to git

```bash
git add .
```

### 1.3 Create first commit

```bash
git commit -m "Initial commit: Smart Expense Tracker with React, Node.js, and AI"
```

### 1.4 Create GitHub Repository

1. Go to **https://github.com/new**
2. Create new repository named: `expense-tracker`
3. **Don't initialize** with README (we have one)
4. Click **"Create repository"**

You'll see commands. Copy the ones for **"push an existing repository"**

### 1.5 Connect to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### ✅ Verify: All files on GitHub

Go to: https://github.com/YOUR_USERNAME/expense-tracker

You should see all your project files! ✅

---

## ✅ STEP 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel

1. Open: **https://vercel.com**
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Search and select your **`expense-tracker`** repository
3. Click **"Import"**

### 2.3 Configure Project

Vercel will auto-detect it's a Vite project. Set:

**Project Settings**:
- **Framework Preset**: Vite ✓ (auto-detected)
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables** - Add one:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `http://localhost:5000/api` |

*(We'll update this after backend is deployed)*

### 2.4 Deploy!

Click **"Deploy"** button and wait (2-3 minutes)

### ✅ Verify Frontend

- You'll get a URL like: `https://expense-tracker-xyz.vercel.app`
- **Copy this URL** - you'll need it!
- Click the link to see your app live! 🎉

---

## ✅ STEP 3: Deploy Backend to Railway

### 3.1 Go to Railway

1. Open: **https://railway.app**
2. Click **"Start Project"**
3. Select **"Deploy from GitHub"**

### 3.2 Connect GitHub

1. Choose **"Configure GitHub App"**
2. Install on your account
3. Allow access to `expense-tracker` repo
4. Select the repo

### 3.3 Configure Deployment

1. **Root Directory**: Leave blank or set to `.`
2. **Service info**:
   - Service name: `backend`
   - Environment: `production`

### 3.4 Set Environment Variables

In Railway dashboard, go to **Variables**:

| Key | Value |
|-----|-------|
| `PORT` | `8000` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://your-vercel-url.com` |
| `PYTHON_WORKER_URL` | `http://localhost:8000` |

*(Replace `your-vercel-url` with your actual Vercel URL from Step 2)*

### 3.5 Deploy

Railway auto-deploys! Check:

1. Go to your Railway project
2. Click **"Deployments"**
3. Wait for **"Success"** status (green checkmark)
4. Copy your deployment URL (looks like: `https://expense-tracker-backend-prod.railway.app`)

### ✅ Verify Backend

Test in terminal:

```bash
curl https://your-railway-url/health
```

Should return: `{"status":"ok"}` ✅

---

## ✅ STEP 4: Update Vercel with Backend URL

### 4.1 Update Frontend Environment

1. Go to **Vercel Dashboard**
2. Select your `expense-tracker` project
3. Click **"Settings"** → **"Environment Variables"**
4. Edit `VITE_API_URL` and change value to your **Railway backend URL**:

```
VITE_API_URL=https://your-railway-url/api
```

### 4.2 Redeploy Frontend

1. Go to Vercel **"Deployments"** tab
2. Click three dots on latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete (green checkmark)

---

## ✅ STEP 5: (Optional) Setup Groq API for Receipt Scanning

### 5.1 Get Free Groq API Key

1. Go to: **https://console.groq.com**
2. Click **"Sign Up"** (use email, no CC!)
3. Verify email
4. Go to **"API Keys"** section
5. Click **"Create API Key"**
6. Copy the key

### 5.2 Add to Railway Backend

1. Go to **Railway Dashboard** → Your backend service
2. Click **"Variables"**
3. Add new variable:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your-groq-api-key-here` |

4. Click **Deploy** to redeploy backend with the key

### 5.3 (Future) Deploy Python Worker

*Optional for now - can add later for receipt scanning*

---

## 🧪 FINAL TESTING IN BROWSER

### Test 1: Open Your Live App

```
https://your-vercel-url.com
```

You should see the Smart Expense Tracker! ✨

### Test 2: Add an Expense

1. Click **"Add Expense"** tab
2. Fill in:
   - Amount: `15.99`
   - Category: `Food`
   - Vendor: `Coffee Shop`
   - Date: Today
   - Description: `Morning coffee`
3. Click **"Add Expense"**

### Test 3: Verify It Saved

1. Click **"All Expenses"** tab
2. You should see your expense listed! ✅
3. Try deleting it

### Test 4: Check Dashboard

1. Click **"Dashboard"** tab
2. You should see total and charts (when you have multiple expenses)

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed on Vercel  
- [ ] Backend deployed on Railway
- [ ] Frontend can call Backend API
- [ ] Added expense appears in database
- [ ] Dashboard shows data
- [ ] Share URL with others (it's live!)

---

## 📊 What's Live Now

| Part | URL | Provider |
|------|-----|----------|
| **Frontend** | https://your-app.vercel.app | Vercel |
| **Backend API** | https://your-backend.railway.app | Railway |
| **Database** | SQLite (Railway file storage) | Railway |

---

## 🔗 Important URLs

- Vercel Dashboard: https://vercel.com/dashboard
- Railway Dashboard: https://railway.app/dashboard
- Your GitHub: https://github.com/YOUR_USERNAME/expense-tracker
- Your Live App: `https://your-vercel-url.com`

---

## 🆘 Troubleshooting

### App shows, but expenses don't save
- Check that `VITE_API_URL` points to correct Railway URL
- Check Railway backend is deployed (green status)
- Open browser developer console (F12) for errors

### CORS Error
- Make sure `CORS_ORIGIN` in Railway matches your Vercel URL
- Redeploy backend after changing it

### Backend not responding
- Check Railway deployment status (should be green)
- Verify environment variables are set
- Check logs on Railway dashboard

### Getting old version
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache

---

## 🚀 Next Steps After Deployment

1. **Custom Domain** (optional): 
   - Buy domain on Namecheap/GoDaddy
   - Point to Vercel (Vercel guides available)

2. **Add More Features**:
   - Recurring expenses
   - Budget alerts
   - Receipt scanning (needs Python worker)
   - Multi-user support

3. **Share Your Portfolio**:
   - Add to LinkedIn
   - GitHub profile
   - Resume/Portfolio site
   - Tweet about it!

---

## 💡 You Now Have

✅ **Full-Stack Web App** (tested locally + deployed online)  
✅ **AI Integration** (Groq API ready for receipts)  
✅ **Zero Cost** (free tiers only)  
✅ **Production Ready** (auto-deploys on git push)  

**Congratulations! 🎉 Your app is LIVE!**

---

**Next: Follow the steps above and we'll verify everything in VS Code's Simple Browser.**
