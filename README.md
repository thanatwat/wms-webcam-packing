# WMS Webcam Packing System

ระบบจัดการคลังสินค้าที่รวมการบันทึกวิดีโอในขณะแพ็คสินค้า พร้อมการอัปโหลดไปยัง Google Drive

## ฟีเจอร์หลัก

- ✅ **Order Management** - จัดการรายการออเดอร์ที่รอการแพ็ค
- ✅ **Barcode Scanning + Video Recording** - สแกนบาร์โค้ดและบันทึกวิดีโออัตโนมัติ
- ✅ **Video Management** - จัดการและแชร์วิดีโอที่บันทึกไว้
- ✅ **User Authentication** - ระบบล็อกอิน/ล็อกเอ้า
- 🚧 **Google Drive Integration** - อัปโหลดวิดีโอไป Google Drive (Coming Soon)

## Tech Stack

**Frontend:**
- React.js 18+ with JavaScript
- React Router, React Query
- Material-UI
- WebRTC API for webcam
- Axios for API calls

**Backend:**
- Hono framework with JavaScript
- JWT authentication
- Prisma ORM
- SQLite database (development)
- Google Drive API (planned)

## การติดตั้งและใช้งาน

### Prerequisites
- Node.js 18+
- npm หรือ yarn

### 1. Clone และติดตั้ง dependencies

```bash
# ติดตั้ง backend dependencies
cd backend
npm install

# ติดตั้ง frontend dependencies  
cd ../frontend
npm install
```

### 2. ตั้งค่า Environment Variables

**Backend (.env):**
```bash
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:3001
```

### 3. ตั้งค่า Database

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

### 4. เริ่มใช้งาน

**เริ่ม Backend Server:**
```bash
cd backend
npm run dev
```

**เริ่ม Frontend Server:**
```bash
cd frontend
npm start
```

### 5. เข้าสู่ระบบ

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

**บัญชีทดสอบ:**
- Admin: `admin` / `admin123`
- Packer1: `packer1` / `packer123`
- Packer2: `packer2` / `packer123`

## การใช้งาน

### 1. หน้า Orders
- ดูรายการออเดอร์ที่รอการแพ็ค
- แสดงข้อมูลลูกค้า จำนวนสินค้า และ priority

### 2. หน้า Pack Job
- ใส่ Job ID (หรือสแกนบาร์โค้ด)
- กดปุ่ม "Start Recording" เพื่อเริ่มบันทึกวิดีโอ
- กดปุ่ม "Stop Recording" เมื่อเสร็จสิ้น
- กดปุ่ม "Upload Video" เพื่ือบันทึก (จำลองการอัปโหลด)

### 3. หน้า Videos  
- ดูรายการวิดีโอที่บันทึกไว้ทั้งหมด
- คัดลอกลิงก์สำหรับแชร์ (เมื่อเชื่อมต่อ Google Drive แล้ว)

## โครงสร้างโฟลเดอร์

```
web-app01/
├── backend/
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   └── index.js         # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Sample data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   └── App.js          # Main app component
│   └── package.json
└── .kiro/specs/            # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิค

### Orders
- `GET /api/orders` - ดึงรายการออเดอร์
- `POST /api/orders` - สร้างออเดอร์ใหม่
- `PUT /api/orders/:id/status` - อัปเดตสถานะออเดอร์

### Videos
- `GET /api/videos` - ดึงรายการวิดีโอ
- `POST /api/videos/upload` - บันทึกข้อมูลวิดีโอ
- `GET /api/videos/:id` - ดึงข้อมูลวิดีโอตาม ID

## สถานะการพัฒนา

### ✅ เสร็จแล้ว
- [x] ตั้งค่าโปรเจกต์และ development environment
- [x] ระบบ authentication (login/logout)
- [x] Database schema และ models
- [x] Order Management API และ frontend
- [x] Barcode scanning และ webcam recording
- [x] Video Management API และ frontend
- [x] Navigation และ routing
- [x] Responsive design with Material-UI

### 🚧 กำลังพัฒนา / รอพัฒนา
- [ ] Google Drive integration
- [ ] Real-time updates with WebSocket
- [ ] Job status management
- [ ] Error handling และ user feedback
- [ ] Comprehensive testing suite
- [ ] Security measures
- [ ] Performance optimization
- [ ] Deployment configuration

## การปรับแต่งและพัฒนาต่อ

1. **Google Drive Integration:** เพิ่มการเชื่อมต่อ Google Drive API
2. **Barcode Scanner:** เพิ่ม library สำหรับสแกนบาร์โค้ด
3. **Real-time Updates:** เพิ่ม WebSocket สำหรับการอัปเดตแบบ real-time
4. **Testing:** เพิ่ม unit tests และ integration tests
5. **Production Deployment:** ตั้งค่าสำหรับ production environment

## ปัญหาที่อาจพบและการแก้ไข

### Webcam ไม่ทำงาน
- ตรวจสอบ permission ของ browser
- ใช้ HTTPS สำหรับ production

### ไม่สามารถเชื่อมต่อ API
- ตรวจสอบว่า backend server รันอยู่ที่ port 3001
- ตรวจสอบ CORS settings

### Database errors
- รัน `npx prisma db push` ใหม่
- ลบไฟล์ dev.db และรัน seed ใหม่

## สนับสนุนและการติดต่อ

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา
