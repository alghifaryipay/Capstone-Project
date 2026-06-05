# Backend API — Express JS

Jembatan antara React JS dan Python ML Service.

```text
React JS -> Backend Express + SQLite (port 5000) -> ML Service Python (port 8000)
```

---

## Cara Menjalankan

```bash
# 1. Masuk folder
cd backend

# 2. Install dependencies
npm install

# 3. Jalankan server (mode development)
npm run dev
```

Server berjalan di → http://localhost:5000

---

## Endpoint API

| Method | URL | Keterangan |
|--------|-----|------------|
| GET    | http://localhost:5000/api/health  | Cek server aktif |
| POST   | http://localhost:5000/api/predict | Kirim data ke AI |
| POST   | http://localhost:5000/api/predict/demo | Smoke test prediksi tanpa auth |
| GET    | http://localhost:5000/api/history | Riwayat prediksi |
| GET    | http://localhost:5000/api/user    | Data pengguna |

---

## Test di Postman

### GET /api/health
```
GET http://localhost:5000/api/health
```

### POST /api/predict
```
POST http://localhost:5000/api/predict
Content-Type: application/json

{
  "kwh": 250,
  "month": "2026-06"
}
```

### GET /api/history
```
GET http://localhost:5000/api/history
```

### GET /api/user
```
GET http://localhost:5000/api/user
```

---

## Konfigurasi (.env)

```
PORT=5000               ← Port server Express
ML_SERVICE_URL=http://localhost:8000   ← URL Python FastAPI
AI_SAMPLE_DATA_PATH=../../ai/household_daily_clean.csv
TARIFF_PER_KWH=1444.7
SQLITE_DB_PATH=data/smart-energy.sqlite
NODE_ENV=development
```

> ⚠️ Jika ML Service Python belum aktif, endpoint /api/predict tetap berfungsi
> menggunakan response dummy sampai model AI siap.

---

## Struktur Folder

```
backend/
├── config/
│   ├── env.js               ← Baca variabel dari .env
│   └── database.js          ← SQLite file database
├── routes/
│   ├── index.js             ← Gabungan semua route
│   ├── healthRoutes.js
│   ├── predictRoutes.js
│   ├── historyRoutes.js
│   └── userRoutes.js
├── controllers/
│   ├── healthController.js
│   ├── predictController.js
│   ├── historyController.js
│   └── userController.js
├── services/
│   └── mlService.js         ← Komunikasi ke Python (edit ini saat AI siap)
├── middlewares/
│   ├── validator.js         ← Validasi input dari React
│   └── errorHandler.js     ← Tangkap semua error
├── .env                     ← Konfigurasi lokal
├── data/                    ← SQLite database lokal, tidak ikut Git
├── app.js                   ← Setup middleware + routes
├── server.js                ← Entry point
└── package.json
```

---

## Integrasi dengan React (Axios)

```javascript
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Cek server
const checkHealth = () => API.get('/health');

// Kirim prediksi
const getPrediction = (kwh, month) => API.post('/predict', { kwh, month });

// Ambil riwayat
const getHistory = () => API.get('/history');

// Ambil data user
const getUser = () => API.get('/user');
```

---

## Cara Sambungkan ke ML Python (Saat Model Siap)

Integrasi utama ada di `services/mlService.js`. Service ini menerima payload lama dari React seperti `{ kwh, month }`, lalu menerjemahkannya menjadi payload FastAPI AI yang membutuhkan minimal 30 record historis.
