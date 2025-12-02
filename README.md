# PlanFlow Backend

Task management and productivity app backend built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- 🔐 **User Authentication**: JWT-based authentication
  - 🕐 **Token Expiration**: 1-day token validity
  - 🔒 **Auto Logout**: Automatic redirect on token expiration
  - 🍪 **HttpOnly Cookies**: Secure token storage
- ✅ **Task Management**: Full CRUD operations
  - 📊 **Status Management**: PENDING, IN_PROGRESS, COMPLETED, EXPIRED
  - 🏷️ **Categories & Priorities**: Organize tasks effectively
  - ⏰ **Due Date Tracking**: Automatic expired task detection
- 🎯 **Goal Tracking**: Goals with checklist items
  - ✅ **Checklist Support**: Break down goals into actionable items
  - 📊 **Progress Calculation**: Automatic progress tracking
- 🤖 **AI-Powered Chatbot**: Groq API integration
  - 💬 **Conversation History**: AI remembers last 10 messages
  - 📝 **Context-Aware**: Accesses user's tasks and goals
  - 🌐 **Mongolian Language**: Primary language support
  - 🧠 **Smart Responses**: Task/goal-related and general questions
- 📧 **Email Notifications**: Automated email alerts
  - ⏰ **Task Reminders**: Email 1 hour before due date
  - ✅ **Completion Alerts**: Email when task is completed
  - ⚠️ **Expired Notifications**: Email for overdue tasks
- 🔔 **Real-time Notifications**: Socket.IO integration
  - ⚡ **Instant Updates**: Real-time notification delivery
  - 📱 **Web Notifications**: Browser push notifications
- ⏰ **Automated Cron Jobs**: Scheduled task processing
  - ⏱️ **Every Minute**: Check for due tasks, expired tasks, completed tasks
  - 📧 **Email Sending**: Automatic email dispatch
  - 🔔 **Notification Creation**: Automatic notification generation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Real-time**: Socket.IO
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Scheduling**: node-cron

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database - **[See Database Setup Guide](./DATABASE_SETUP.md)** 📊
  - Recommended: Neon Database (free, no installation)
  - Alternative: Local PostgreSQL or Docker
- Gmail account for email notifications (with App Password enabled)
- Groq API key

## Installation

### Step 1: Clone the repository
```bash
git clone <your-repo-url>
cd v4-backend
```

### Step 2: Install Node.js dependencies

**⚠️ ЧУХАЛ: Энэ алхмыг заавал хийх шаардлагатай!**

Бүх шаардлагатай сангуудыг суулгах:
```bash
npm install
```

Энэ нь дараах сангуудыг суулгана:
- `express` - Web server framework
- `prisma` - Database ORM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `nodemailer` - Email sending
- `socket.io` - Real-time notifications
- `node-cron` - Scheduled tasks
- `dotenv` - Environment variables
- `groq-sdk` - AI chatbot
- `ejs` - Email templates

**Хэрэв алдаа гарвал:**
```bash
# Node modules устгаад дахин оролдох
rm -rf node_modules package-lock.json
npm install

# Эсвэл yarn ашиглах
yarn install
```

### Step 3: Create `.env` file

`.env.example` файлыг copy хийж `.env` үүсгэнэ:
```bash
# Linux/Mac:
cp .env.example .env

# Windows PowerShell:
Copy-Item .env.example .env

# Эсвэл гараар .env файл үүсгээд .env.example-ийн агуулгыг хуулна
```

### Step 4: Configure environment variables

📖 **ДЭЛГЭРЭНГҮЙ ЗААВАР:** [Credentials үүсгэх заавар](./CREDENTIALS_GUIDE.md) ← **10 минутад бүх credentials үүсгэх!**

`.env` файлыг нээгээд өөрийн мэдээллээр солих:

```env
# PostgreSQL database холболт
DATABASE_URL="postgresql://postgres:password@localhost:5432/planflow"

# JWT нууц түлхүүр (аливаа урт тэмдэгт мөр)
SECRET_KEY="your-super-secret-jwt-key-change-this-to-random-string"

# Gmail email тохиргоо
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password  # Gmail App Password!

# Frontend URL
APP_URL=http://localhost:3000

# Groq AI API түлхүүр
GROQ_API_KEY=your-groq-api-key-from-groq-console
```

**Gmail App Password авах:**
1. Gmail → Тохиргоо → Аюулгүй байдал
2. 2-Factor Authentication идэвхжүүлэх
3. App Passwords үүсгэх
4. Үүссэн 16 оронтой кодыг `.env` дээр хуулах

**Groq API Key авах:**
1. https://console.groq.com руу очих
2. Бүртгүүлэх / Нэвтрэх
3. API Keys хэсэгт очиж шинэ түлхүүр үүсгэх
4. Түлхүүрийг `.env` дээр хуулах

### Step 5: Setup Database

Prisma schema-г generate хийж database үүсгэх:
```bash
# Prisma client generate хийх
npx prisma generate

# Database migration ажиллуулах (бүх table үүсгэнэ)
npx prisma migrate dev --name init

# Эсвэл зөвхөн sync хийх
npx prisma db push
```

**Database сонголтууд:**

**Сонголт 1: Neon Database (Санал болгож байна - Хялбар!)**

Neon нь үнэгүй cloud PostgreSQL database юм. Локал компьютерт суулгах шаардлагагүй!

1. https://neon.tech руу очих
2. GitHub эсвэл Google-аар бүртгүүлэх (үнэгүй)
3. "Create a project" дарах
4. Project нэр өгөх (жишээ: `planflow`)
5. Connection string хуулах (жишээ):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/planflow?sslmode=require
   ```
6. `.env` файлдаа хуулах:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/planflow?sslmode=require"
   ```

✅ **Давуу тал:** Суулгах шаардлагагүй, үнэгүй, хурдан, автоматаар backup  
❌ **Сул тал:** Интернэт шаардлагатай

**Сонголт 2: PostgreSQL (Локал суулгах)**

- [PostgreSQL татах](https://www.postgresql.org/download/)
- Connection string: `postgresql://postgres:password@localhost:5432/planflow`

**Сонголт 3: Docker**

```bash
docker run --name planflow-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

**⚠️ АНХААР:** Та өөрийн database үүсгэх ёстой! GitHub дээр `.env` файл байхгүй учраас таны DATABASE_URL бусдад харагдахгүй (аюулгүй).

### Step 6: Start the server

```bash
node server.js
```

✅ Server амжилттай ажиллавал: **`Server running on port 8000`**

Серверийг test хийх:
```bash
curl http://localhost:8000/api/test-email
```

The server will run on `http://localhost:8000`

## Common Issues / Түгээмэл асуудал

### 1. `npm install` алдаа
```bash
# Node.js хувилбар шалгах (16+ байх ёстой)
node --version

# npm cache цэвэрлэх
npm cache clean --force
npm install
```

### 2. Database холбогдохгүй байна
```bash
# PostgreSQL ажиллаж байгаа эсэхийг шалгах
# Windows: services.msc дээр PostgreSQL хайх
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# DATABASE_URL зөв эсэхийг шалгах
echo $DATABASE_URL  # Linux/Mac
$env:DATABASE_URL   # Windows PowerShell
```

### 3. Prisma алдаа
```bash
# Prisma client дахин generate хийх
npx prisma generate

# Database reset хийх (БҮГДИЙГ устгана!)
npx prisma migrate reset
```

### 4. Email илгээгдэхгүй байна
- Gmail App Password зөв эсэхийг шалгах
- Gmail 2FA идэвхтэй эсэхийг шалгах
- `EMAIL_USER` болон `EMAIL_PASS` зөв эсэхийг шалгах

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/logout` - Logout user

### Tasks
- `GET /api/task/get-tasks` - Get all tasks
- `POST /api/task/add-task` - Create new task
- `PUT /api/task/:id` - Update task
- `DELETE /api/task/:id` - Delete task

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `POST /api/goals/:goalId/items` - Add checklist item to goal
- `PUT /api/goals/items/:id` - Toggle checklist item

### AI Chatbot
- `POST /api/ai/message` - Send message to AI
- `GET /api/ai/messages` - Get chat history
- `DELETE /api/ai/messages` - Clear chat history

### Notifications
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications/:id` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
3. Use this app password in your `.env` file

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

Key models:
- **User**: User accounts
- **Task**: Task management
- **Goal**: Goal tracking with checklist items
- **Notification**: User notifications
- **ChatMessage**: AI chatbot conversation history

## Cron Jobs

Automated tasks run every minute:
- Check for tasks due within 1 hour → send reminder
- Check for expired tasks → send notification
- Check for completed tasks → send congratulations email

## License

MIT

#   G i r l c o d e  
 