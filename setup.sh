#!/bin/bash

# Smart Expense Tracker - Setup Script

echo "🚀 Setting up Smart Expense Tracker..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from nodejs.org"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install from python.org"
    exit 1
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

# Create Environment Files
echo -e "\n${BLUE}Creating environment files...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${YELLOW}⚠ backend/.env already exists${NC}"
fi

if [ ! -f "python-worker/.env" ]; then
    cp python-worker/.env.example python-worker/.env
    echo -e "${GREEN}✓ Created python-worker/.env${NC}"
    echo -e "${YELLOW}⚠ Remember to add your GROQ_API_KEY to python-worker/.env${NC}"
else
    echo -e "${YELLOW}⚠ python-worker/.env already exists${NC}"
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"

echo "Installing backend dependencies..."
cd backend
npm install
cd ..
echo -e "${GREEN}✓ Backend ready${NC}"

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo -e "${GREEN}✓ Frontend ready${NC}"

echo "Setting up Python environment..."
cd python-worker
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Python virtual environment created${NC}"
fi
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Python environment ready${NC}"

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Edit python-worker/.env and add your Groq API key"
echo "2. Run services:"
echo "   - Backend:  cd backend && npm run dev"
echo "   - Python:   cd python-worker && python main.py"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose:"
echo "   docker-compose up"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "Python:   http://localhost:8000"
