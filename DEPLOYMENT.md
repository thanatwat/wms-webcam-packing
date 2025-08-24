# WMS Webcam Packing - Deployment Guide

## 🚀 การ Deploy แบบฟรี

### Step 1: เตรียม Backend (Railway)

1. **สร้างบัญชี Railway**
   - ไปที่ https://railway.app
   - Sign up ด้วย GitHub

2. **Deploy Backend**
   ```bash
   # ใน folder backend
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

3. **ตั้งค่าใน Railway**
   - เลือก "Deploy from GitHub repo"
   - เลือก folder `backend`
   - ตั้งค่า Environment Variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your-super-secret-jwt-key-change-this
     JWT_EXPIRES_IN=7d
     ```

4. **เพิ่ม PostgreSQL Database**
   - ใน Railway dashboard กด "+ Add Service"
   - เลือก "PostgreSQL" 
   - Railway จะสร้าง DATABASE_URL อัตโนมัติ

5. **Deploy Commands**
   - Build Command: `npm run build`
   - Start Command: `npm start`

### Step 2: เตรียม Frontend (Vercel)

1. **สร้างบัญชี Vercel**
   - ไปที่ https://vercel.com
   - Sign up ด้วย GitHub

2. **Deploy Frontend**
   ```bash
   # ใน folder frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

3. **ตั้งค่าใน Vercel**
   - เลือก "Import Git Repository"
   - เลือก folder `frontend`
   - ตั้งค่า Environment Variables:
     ```
     REACT_APP_API_URL=https://your-backend-name.railway.app
     ```

### Step 3: อัปเดต CORS

หลังจาก deploy แล้ว อัปเดต CORS ใน backend:
```javascript
// ใน src/index.js
app.use('*', cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true,
}));
```

## 🔧 ทางเลือกอื่น

### Option 1: Render (Full-Stack)
- Frontend + Backend ในที่เดียว
- PostgreSQL ฟรี
- https://render.com

### Option 2: Netlify + Railway
- Netlify สำหรับ Frontend
- Railway สำหรับ Backend

### Option 3: GitHub Pages + Railway
- GitHub Pages สำหรับ Static Frontend
- Railway สำหรับ Backend

## 📱 สำหรับการ Demo

### Deploy ง่ายๆ ด้วย ngrok (ชั่วคราว)
```bash
# ติดตั้ง ngrok
npm install -g ngrok

# สำหรับ backend
ngrok http 3001

# สำหรับ frontend  
ngrok http 3002
```

## 🛠️ Production Checklist

- [ ] เปลี่ยน JWT_SECRET เป็นค่าที่ปลอดภัย
- [ ] เปลี่ยน Database เป็น PostgreSQL
- [ ] ตั้งค่า CORS ให้ถูกต้อง
- [ ] เพิ่ม HTTPS
- [ ] ตั้งค่า Environment Variables
- [ ] ทดสอบการทำงานใน production

## 💡 Tips

1. **ใช้ Railway สำหรับ Backend** - รองรับ Node.js และ PostgreSQL ฟรี
2. **ใช้ Vercel สำหรับ Frontend** - เร็วและง่าย
3. **ใช้ GitHub Repository** - สำหรับ version control และ auto-deploy
4. **เตรียม Google Drive API** - สำหรับ production ใช้งานจริง
