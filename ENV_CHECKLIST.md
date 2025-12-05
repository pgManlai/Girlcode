# ✅ Environment Variables Checklist

## 🔴 Backend (Render/Vercel/Railway) - REQUIRED

### Database
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```
**Чухал:** Supabase-аас connection string авахдаа `?sslmode=require` нэмэх!

### Authentication
```
SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-long
```
**Чухал:** Хамгийн багадаа 32 тэмдэгт байх ёстой!

### Server Configuration
```
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```
**Чухал:** 
- Render-д `PORT=10000` заавал байх ёстой
- `FRONTEND_URL` нь яг frontend URL байх ёстой (trailing slash байхгүй)

### AI Chatbot (Optional but Recommended)
```
GROQ_API_KEY=your-groq-api-key-here
```
Groq API key авах: https://console.groq.com

### Email (Optional)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
APP_URL=https://your-backend.onrender.com
```
**Чухал:** Gmail ашиглах бол App Password үүсгэх ёстой!

---

## 🔵 Frontend (Vercel/Netlify) - REQUIRED

### API Configuration
```
VITE_API_URL=https://your-backend.onrender.com/api
```
**Чухал:** 
- `/api` нь аль хэдийн байгаа тул зөвхөн backend URL + `/api` бичнэ
- Жишээ: `https://myapp.onrender.com/api`

---

## 📋 Quick Setup Guide

### Step 1: Supabase Database
1. https://supabase.com руу орох
2. New Project үүсгэх
3. Settings → Database → Connection string авах
4. `DATABASE_URL` гэж нэмэх

### Step 2: Backend Environment Variables (Render)
1. Render dashboard → Your Web Service → Environment
2. Дээрх бүх variables нэмэх
3. Save → Manual Deploy

### Step 3: Frontend Environment Variables (Vercel)
1. Vercel dashboard → Your Project → Settings → Environment Variables
2. `VITE_API_URL` нэмэх
3. Redeploy

---

## 🧪 Test Commands

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
```
**Хариу:** `{"status":"ok","timestamp":"..."}`

### Database Connection Test
```bash
cd v4-backend
npx prisma db push
```

### Frontend API Test
Browser console-д:
```javascript
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## ❌ Нийтлэг алдаанууд

### 1. "DATABASE_URL is not set"
**Шийдэл:** Backend environment variables-д `DATABASE_URL` нэмэх

### 2. "CORS policy: No 'Access-Control-Allow-Origin'"
**Шийдэл:** 
- Backend-д `FRONTEND_URL` зөв эсэхийг шалгах
- Frontend URL-ийг CORS-д нэмэх

### 3. "Network Error" эсвэл "Failed to fetch"
**Шийдэл:**
- `VITE_API_URL` зөв эсэхийг шалгах
- Backend ажиллаж байгаа эсэхийг шалгах (`/health` endpoint)

### 4. "Prisma Client not generated"
**Шийдэл:**
- Render build command-д `npm run prisma:generate` нэмэх
- Build Command: `npm install && npm run prisma:generate`

---

## 🔐 Security Notes

1. **SECRET_KEY:** Хэзээ ч GitHub-д commit хийхгүй!
2. **DATABASE_URL:** Хэзээ ч GitHub-д commit хийхгүй!
3. **API Keys:** Хэзээ ч GitHub-д commit хийхгүй!
4. `.env` файлыг `.gitignore`-д нэмэх!

---

## ✅ Verification Checklist

Deploy хийсний дараа шалгах:

- [ ] Backend `/health` endpoint ажиллаж байна
- [ ] Frontend console-д API URL зөв харагдаж байна
- [ ] Login хийх боломжтой
- [ ] Database connection ажиллаж байна
- [ ] CORS error байхгүй
- [ ] Environment variables бүгд зөв

