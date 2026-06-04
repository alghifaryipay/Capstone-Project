# Smart Energy Capstone Project

Monorepo untuk integrasi Frontend, Backend, dan AI service prediksi konsumsi listrik rumah tangga.

## Struktur

```text
.
├── frontend/  # React + Vite
├── backend/   # Express API gateway
└── ai/        # FastAPI + TensorFlow forecasting model
```

## Alur Integrasi

```text
Frontend React -> Backend Express -> AI FastAPI -> TensorFlow .keras model
```

- Frontend mengirim input penggunaan listrik ke Backend.
- Backend menjaga format response yang dipakai Frontend dan meneruskan request ke AI service.
- AI service memuat model `.keras`, scaler, dan metadata untuk inference.

## Setup

### 1. Frontend dan Backend

```bash
npm run install:all
```

Salin env:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 2. AI Service

```bash
cd ai
uv venv --python 3.11 .venv
uv pip install -r requirements.txt --python .venv/bin/python
```

Alternatif tanpa `uv`:

```bash
cd ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Menjalankan Aplikasi

Terminal 1:

```bash
cd ai
source .venv/bin/activate
PYTHONPATH=src uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Terminal 2:

```bash
npm run dev:backend
```

Terminal 3:

```bash
npm run dev:frontend
```

URL lokal:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`
- AI docs: `http://localhost:8000/docs`

Catatan Linux watcher limit: backend dev memakai `nodemon --legacy-watch` dan frontend Vite memakai polling watcher agar tidak gagal dengan error `ENOSPC: System limit for number of file watchers reached`.

Catatan database: backend memakai SQLite file database di `backend/data/smart-energy.sqlite`, jadi tidak perlu setup server database eksternal. Folder `backend/data/` tidak ikut dipush.

## Endpoint Integrasi

Backend utama:

```http
POST /api/predict
```

Membutuhkan token login seperti flow aplikasi FE.

Endpoint demo tanpa auth untuk smoke test integrasi BE -> AI:

```http
POST /api/predict/demo
```

Contoh payload:

```json
{
  "kwh": 250,
  "month": "2026-06"
}
```

Backend akan menerjemahkan payload tersebut ke format AI service berbasis 30 record historis.

## Validasi Yang Sudah Dilakukan

- AI inference CLI berhasil memuat model `.keras`.
- AI FastAPI `/predict` berhasil menghasilkan prediksi.
- Backend Express berhasil meneruskan payload demo ke AI service.
- Frontend lint berhasil.
- Frontend React berhasil di-build.

Detail progress AI ada di `ai/docs/progress_report.md`.
