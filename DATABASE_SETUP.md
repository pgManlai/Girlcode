# Database Setup - Өгөгдлийн сангийн тохиргоо

⚠️ **АНХААР:** Та **өөрийн** database үүсгэх ёстой! GitHub дээрх код-д database байхгүй.

## 🌟 Сонголт 1: Neon Database (Санал болгож байна!)

**Яагаад Neon гэж?**
- ✅ Суулгах шаардлагагүй
- ✅ 2 минутад бэлэн
- ✅ Үнэгүй (500MB storage)
- ✅ Автоматаар backup
- ✅ Production-ready
- ✅ PostgreSQL (бүрэн үнэнч)

### Алхам алхмаар заавар:

#### 1. Бүртгүүлэх
- https://neon.tech руу очих
- **Sign Up** дарах
- GitHub, Google, эсвэл Email-ээр бүртгүүлэх

#### 2. Project үүсгэх
Бүртгүүлсний дараа:
- **Create a project** товч дарах
- Project нэр өгөх: `planflow` (эсвэл дурын нэр)
- Region автоматаар сонгогдоно (хамгийн ойрхон)
- PostgreSQL version: 15 эсвэл 16 (default OK)
- **Create project** дарах

#### 3. Connection String авах
Project үүссэний дараа dashboard дээр:

1. **Connection Details** хэсэг рүү очих
2. **Connection string** хэсэгт очих
3. **Framework сонгох: Prisma** (маш чухал!)
4. Connection string харагдана:
```
postgresql://neondb_owner:npg_xxxxxxxxxxxx@ep-cool-mountain-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
```

#### 4. .env файлд хуулах

Backend folder дээрх `.env` файлыг нээгээд:
```env
DATABASE_URL="postgresql://neondb_owner:npg_xxxxxxxxxxxx@ep-cool-mountain-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**⚠️ Анхаар:**
- Бүхэлд нь хуулах (эхнээс эцэс хүртэл)
- `?sslmode=require` хэсгийг орхигдуулахгүй байх
- Хашилтанд хийх: `"..."`

#### 5. Database schema үүсгэх

Terminal дээр:
```bash
cd v4-backend
npx prisma generate
npx prisma db push
```

Амжилттай бол:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema.
```

#### 6. Шалгах

Prisma Studio нээх:
```bash
npx prisma studio
```

Browser дээр `http://localhost:5555` нээгдэж, table үүссэнийг харна:
- User
- Task
- Goal
- GoalItem
- Notification
- ChatMessage

#### 7. Бэлэн! 🎉

Одоо backend эхлүүлж болно:
```bash
node server.js
```

---

## 🔧 Сонголт 2: Local PostgreSQL

Хэрэв интернэтгүй ажиллах эсвэл локал database хүсвэл:

### Windows:
1. https://www.postgresql.org/download/windows/ татах
2. Installer ажиллуулж суулгах
3. Суулгах үед password тохируулах (санаж байх!)
4. Port: 5432 (default үлдээх)

### Mac:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Database үүсгэх:
```bash
# PostgreSQL нэвтрэх
psql -U postgres

# Database үүсгэх
CREATE DATABASE planflow;

# User үүсгэх (optional)
CREATE USER planflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE planflow TO planflow_user;

# Гарах
\q
```

### .env тохируулах:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/planflow"
```

### Prisma ажиллуулах:
```bash
npx prisma generate
npx prisma db push
```

---

## 🐳 Сонголт 3: Docker

Хэрэв Docker суугаа бол:

```bash
# PostgreSQL container эхлүүлэх
docker run --name planflow-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=planflow \
  -p 5432:5432 \
  -d postgres:15

# Connection string:
DATABASE_URL="postgresql://postgres:password@localhost:5432/planflow"

# Container status шалгах
docker ps

# Logs шалгах
docker logs planflow-db
```

---

## ❓ Түгээмэл асуултууд

### Q: Би Neon-ийн database-ийг бусадтай хуваалцаж болох уу?
**A:** Үгүй! Хуваалцах хэрэггүй. Хүн бүр өөрийнхөө үнэгүй database үүсгэнэ (2 минут л зарцуулна).

### Q: Neon үнэгүй хэр удаан ашиглаж болох вэ?
**A:** Мөнхөд үнэгүй (Free tier). Зөвхөн storage limit: 500MB.

### Q: Миний database бусдад харагдах уу?
**A:** Үгүй. `.env` файл git-д байхгүй (`.gitignore`-д байгаа). Зөвхөн та connection string-ээ мэддэг.

### Q: Хэрэв Neon project устгавал юу болох вэ?
**A:** Таны бүх өгөгдөл устана. Гэхдээ шинэ project үүсгээд дахин `npx prisma db push` хийвэл table бүгд дахин үүснэ (хоосон).

### Q: Production (бодит ашиглалтад) Neon ашиглаж болох уу?
**A:** Тийм! Neon production-ready. Олон том компани ашигладаг.

### Q: DATABASE_URL-ээ хэрхэн хамгаалах вэ?
**A:** 
- `.env` файл git-д commit хийхгүй байх
- GitHub дээр `.env` байхгүй (`.gitignore` дотор)
- Connection string-ээ хэнд ч өгөхгүй байх

---

## 🆘 Алдаа гарвал

### "Error: P1001: Can't reach database server"
- Интернэт холболт шалгах (Neon бол)
- PostgreSQL ажиллаж байгаа эсэх шалгах (Local бол)
- DATABASE_URL зөв эсэхийг шалгах

### "Error: Schema engine error"
- `npx prisma generate` дахин ажиллуулах
- `node_modules` устгаад `npm install` хийх

### "SSL connection required"
- DATABASE_URL сүүлд `?sslmode=require` байгаа эсэхийг шалгах (Neon)

### "Too many connections"
- Free tier дээр maximum 100 connections
- Server дахин эхлүүлэх

---

## ✅ Шалгах жагсаалт

Database тохируулалт бүрэн гүйцэд байгаа эсэхийг шалгаарай:

- [ ] Database үүссэн (Neon/Local/Docker)
- [ ] CONNECTION_STRING хуулсан
- [ ] `.env` файлд `DATABASE_URL` тохируулсан
- [ ] `npx prisma generate` амжилттай
- [ ] `npx prisma db push` амжилттай
- [ ] `npx prisma studio` ажиллаж table үүссэнийг харсан
- [ ] `node server.js` ажиллаж "Server running" гарсан

Бүгд амжилттай бол бэлэн! 🚀

