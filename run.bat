@echo off
echo Khởi động hệ thống Mielove.vn...

echo [1/2] Bật Backend FastAPI tại http://localhost:8000
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo [2/2] Bật Frontend Next.js tại http://localhost:3000
start cmd /k "cd frontend && npm run dev"

echo Mielove.vn đã sẵn sàng! 
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/docs
pause
