# Backend Setup Guide - Дэлгэрэнгүй заавар

## 📋 Шаардлагатай сангууд (Dependencies)

Backend ажиллахад дараах Node.js сангууд шаардлагатай:

### Core Dependencies
- **express** - Web server framework
- **@prisma/client** - Database ORM client
- **bcrypt** - Password хашлах
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie удирдлага
- **cors** - Cross-origin requests

### Email & Notifications
- **nodemailer** - Email илгээх
- **ejs** - Email template rendering
- **socket.io** - Real-time notifications

### AI & Automation
- **groq-sdk** - AI chatbot (Groq API)
- **node-cron** - Scheduled tasks (every minute)

### Dev Dependencies
- **prisma** - Database migrations & schema management
- **dotenv** - Environment variables

## 🚀 Алхам алхмаар суулгах заавар

### 1. Node.js шалгах

```bash
node --version
# v18.0.0 эсвэл дээш байх ёстой
```

Хэрэв суугаагүй бол: https://nodejs.org/

### 2. Database сонгох

**🌟 Сонголт 1: Neon Database (Санал болгож байна!)**

Neon нь үнэгүй cloud PostgreSQL. Компьютерт юу ч суулгах шаардлагагүй!

**Алхмууд:**

1. **https://neon.tech** руу очих
2. **Sign up** дарж бүртгүүлэх (GitHub/Google/Email)
3. **Create a project** дарах
4. **Project settings:**
   - Name: `planflow` (эсвэл дурын нэр)
   - Region: автоматаар сонгоно
   - PostgreSQL version: 15+ (default)
5. **Create project** дарах
6. **Connection string хуулах:**
   
   "Connection string" хэсэгт очиж **Prisma** сонгоно:
   ```
   postgresql://neondb_owner:xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   
7. `.env` файлдаа хуулах:
   ```env
   DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

✅ **Давуу тал:**
- Суулгах шаардлагагүй
- 2 минутад бэлэн болно
- Үнэгүй (500MB хүртэл)
- Автоматаар backup
- Хаанаас ч хандаж болно

❌ **Сул тал:**
- Интернэт холболт шаардлагатай

**🔧 Сонголт 2: PostgreSQL локал суулгах**

Хэрэв интернэтгүй ажиллах бол локал суулгаарай:

**Windows:**
1. https://www.postgresql.org/download/windows/ татах
2. Installer ажиллуулах
3. Password тохируулах (санаж байх!)
4. Port: 5432 (default)

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**PostgreSQL test:**
```bash
psql -U postgres
# Password оруулна
# postgres=# гэсэн prompt харагдвал амжилттай
```

**Connection string:**
```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/planflow"
```

**🐳 Сонголт 3: Docker**

```bash
docker run --name planflow-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=planflow \
  -p 5432:5432 \
  -d postgres:15

# Connection string:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/planflow"
```

### 3. Project clone & dependencies

```bash
cd v4-backend
npm install
```

**Суулгагдах сангууд (~150MB):**
- express, prisma, bcrypt, jwt, nodemailer...
- Нийт ~50 packages

**Алдаа гарвал:**
```bash
# 1. npm cache цэвэрлэх
npm cache clean --force

# 2. node_modules устгаад дахин суулгах
rm -rf node_modules package-lock.json
npm install

# 3. Өөр package manager ашиглах
yarn install  # эсвэл
pnpm install
```

### 4. .env файл тохируулах

**4.1. Файл үүсгэх:**
```bash
cp .env.example .env
```

**4.2. DATABASE_URL:**
```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/planflow"
```

Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`

**PostgreSQL бүртгэлтэй хэрэглэгч үүсгэх:**
```sql
-- psql дээр ажиллуулах
CREATE DATABASE planflow;
CREATE USER planflow_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE planflow TO planflow_user;
```

**4.3. SECRET_KEY:**
```env
SECRET_KEY="random-string-min-32-characters-for-security"
```

Санамсаргүй утга үүсгэх:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4.4. EMAIL (Gmail App Password):**

Алхам:
1. Gmail Settings → Security
2. 2-Step Verification идэвхжүүлэх
3. App passwords хэсэг рүү очих
4. "Mail" app сонгож password үүсгэх
5. Үүссэн 16 оронтой кодыг хуулах

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # 16 тэмдэгт
```

**4.5. GROQ_API_KEY:**

1. https://console.groq.com руу очих
2. Sign up / Sign in
3. API Keys → Create API Key
4. Key-г хуулах

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Database setup

```bash
# Prisma client generate
npx prisma generate

# Database schema sync
npx prisma db push

# Эсвэл migration үүсгэх
npx prisma migrate dev --name init
```

**Database шалгах:**
```bash
npx prisma studio
# Browser дээр http://localhost:5555 нээгдэнэ
# Table үүссэнийг харна
```

### 6. Server эхлүүлэх

```bash
node server.js
```

**Амжилттай ажиллавал:**
```
⏱ Cron jobs started using EJS templates.
Server running on port 8000
```

### 7. Test хийх

**Backend test:**
```bash
curl http://localhost:8000/api/test-email
```

**Register test:**
```bash
curl -X POST http://localhost:8000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

## 🐛 Алдаа засах

### Алдаа: "Cannot find module 'xxx'"
```bash
npm install xxx
# Эсвэл бүгдийг дахин суулгах
npm install
```

### Алдаа: "Port 8000 already in use"
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <process-id> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Алдаа: "Prisma Client is not generated"
```bash
npx prisma generate
```

### Алдаа: "Database connection failed"
- PostgreSQL ажиллаж байгаа эсэхийг шалгах
- DATABASE_URL зөв эсэхийг шалгах
- Database үүссэн эсэхийг шалгах: `psql -U postgres -c "\l"`

### Алдаа: "Email sending failed"
- Gmail App Password зөв эсэхийг шалгах
- 2-Factor Authentication идэвхтэй эсэхийг шалгах
- EMAIL_USER болон EMAIL_PASS зөв эсэхийг шалгах

## ✅ Бүгд амжилттай!

Backend server ажиллаж байвал frontend руу шилжинэ:
```bash
cd ../PlanFlow
npm install
npm run dev
```

