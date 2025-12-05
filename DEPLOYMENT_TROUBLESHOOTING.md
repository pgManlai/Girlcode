# 🔧 Deployment Troubleshooting Guide

## ❌ Нийтлэг асуудлууд ба шийдлүүд

### 1. **Backend ажиллахгүй байна**

#### Шалгах зүйлс:
- ✅ Environment variables зөв эсэх
- ✅ Database connection ажиллаж байгаа эсэх
- ✅ Port number зөв эсэх
- ✅ Dependencies суусан эсэх

#### Шийдэл:
```bash
# Backend folder-д орох
cd v4-backend

# Dependencies суулгах
npm install

# Prisma generate хийх
npm run prisma:generate

# Environment variables шалгах
# .env файлд дараах зүйлс байх ёстой:
# - DATABASE_URL
# - SECRET_KEY (JWT secret)
# - GROQ_API_KEY
# - FRONTEND_URL
# - PORT (optional, default: 8000)
```

---

### 2. **Frontend backend-тэй холбогдохгүй байна**

#### Шалгах зүйлс:
- ✅ `VITE_API_URL` environment variable зөв эсэх
- ✅ CORS тохиргоо зөв эсэх
- ✅ Backend URL зөв эсэх

#### Шийдэл:

**Frontend-д:**
```bash
# PlanFlow/client folder-д .env.production файл үүсгэх
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Backend-д:**
```bash
# .env файлд:
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**CORS шалгах:**
- Backend-ийн `server.js` файлд frontend URL-ийг нэмсэн эсэхийг шалгах
- Render/Vercel dashboard-аас environment variables шалгах

---

### 3. **Database connection алдаа**

#### Шалгах зүйлс:
- ✅ `DATABASE_URL` зөв эсэх
- ✅ Database server ажиллаж байгаа эсэх
- ✅ Prisma migrations хийгдсэн эсэх

#### Шийдэл:
```bash
# Database connection test хийх
cd v4-backend
npx prisma db push

# Хэрэв алдаа гарвал DATABASE_URL-ийг шалгах
# Supabase-д: Project Settings → Database → Connection string
```

**DATABASE_URL формат:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

---

### 4. **Environment Variables Checklist**

#### Backend (.env эсвэл Render Environment Variables):
```
✅ DATABASE_URL=postgresql://...
✅ SECRET_KEY=your-jwt-secret-key-here
✅ GROQ_API_KEY=your-groq-api-key
✅ FRONTEND_URL=https://your-frontend.vercel.app
✅ PORT=10000 (Render-д заавал)
✅ NODE_ENV=production
✅ EMAIL_USER=your-email@gmail.com (optional)
✅ EMAIL_PASS=your-email-password (optional)
✅ APP_URL=https://your-backend.onrender.com (optional)
```

#### Frontend (Vercel Environment Variables):
```
✅ VITE_API_URL=https://your-backend.onrender.com/api
```

**Чухал:** Frontend-д `/api` нэмэхгүй байх! `helper.js` файлд аль хэдийн `/api` байна.

---

### 5. **Render-д Deploy хийхэд алдаа гарч байна**

#### Build Command:
```bash
npm install && npm run prisma:generate
```

#### Start Command:
```bash
npm start
```

#### Root Directory:
```
v4-backend
```

---

### 6. **Vercel-д Deploy хийхэд алдаа гарч байна**

#### Root Directory:
```
PlanFlow/client
```

#### Build Command:
```bash
npm run build
```

#### Output Directory:
```
dist
```

#### Framework Preset:
```
Vite
```

---

### 7. **CORS Error гарч байна**

#### Backend server.js-д:
```javascript
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "https://your-frontend.vercel.app", // Яг URL-ийг нэмэх
        "http://localhost:5173", // Development
    ].filter(Boolean),
    credentials: true
}));
```

**Шалгах:**
- Frontend URL-ийг backend-ийн CORS-д нэмсэн эсэх
- `FRONTEND_URL` environment variable зөв эсэх

---

### 8. **API calls 404 эсвэл 500 error буцааж байна**

#### Шалгах:
1. Backend logs шалгах (Render dashboard)
2. API endpoint зөв эсэх: `/api/...`
3. Request method зөв эсэх (GET, POST, PUT, DELETE)

#### Test хийх:
```bash
# Backend health check
curl https://your-backend.onrender.com/api/health

# Login test
curl -X POST https://your-backend.onrender.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

### 9. **Render Free Tier - Sleep Mode**

Render free tier-д 15 минутын дараа sleep хийх. Эхний request удаан байж болно (30-60 секунд).

**Шийдэл:**
- Paid plan ашиглах
- Эсвэл Railway/Fly.io ашиглах

---

### 10. **Prisma Client Generate хийгдээгүй**

#### Шийдэл:
```bash
cd v4-backend
npm run prisma:generate
```

Render-д deploy хийхэд build command-д нэмэх:
```bash
npm install && npm run prisma:generate
```

---

## 🔍 Debugging Steps

### Step 1: Backend Logs шалгах
1. Render dashboard руу орох
2. "Logs" tab дарж шалгах
3. Error messages-ийг унших

### Step 2: Frontend Console шалгах
1. Browser-ийн Developer Tools нээх (F12)
2. Console tab шалгах
3. Network tab шалгах - API calls амжилттай эсэх

### Step 3: Environment Variables шалгах
1. Render: Environment → Environment Variables
2. Vercel: Settings → Environment Variables
3. Бүх required variables байгаа эсэхийг шалгах

### Step 4: Database Connection Test
```bash
# Local-оос test хийх
cd v4-backend
npx prisma studio
# Эсвэл
npx prisma db push
```

---

## 📞 Тусламж авах

Хэрэв дээрх зүйлс ажиллахгүй бол:
1. Backend logs-ийг screenshot хийх
2. Frontend console errors-ийг screenshot хийх
3. Environment variables (sensitive data-г нууцлаад) screenshot хийх

---

## ✅ Success Checklist

Deploy амжилттай бол дараах зүйлс ажиллах ёстой:

- [ ] Backend URL ажиллаж байна (https://your-backend.onrender.com)
- [ ] Frontend URL ажиллаж байна (https://your-frontend.vercel.app)
- [ ] Login хийх боломжтой
- [ ] Tasks үүсгэх боломжтой
- [ ] Database connection ажиллаж байна
- [ ] CORS error байхгүй
- [ ] API calls амжилттай

