# Full Stack Integration Plan

Dokumen ini menjelaskan alur integrasi AI forecasting ke Data Science, Backend, dan Frontend.

## Status Project AI

Progress yang sudah terlihat di repository:

- Dataset tersedia: `household_daily_clean.csv` dan `household_monthly_clean.csv`.
- Notebook awal tersedia: `01_initial_ai_pipeline_energy_forecasting.ipynb`.
- Struktur side quest sudah ditambahkan:
  - Training script: `src/energy_forecasting/train.py`
  - Inference module: `src/energy_forecasting/inference.py`
  - FastAPI service: `app/main.py`
  - CLI inference: `run_inference.py`
  - Requirements: `requirements.txt`
- Artefak model sudah berhasil dibuat setelah training lokal:
  - `models/energy_forecasting_lstm.keras`
  - `artifacts/minmax_scaler.joblib`
  - `artifacts/model_metadata.json`
  - `artifacts/metrics.json`

## Alur Integrasi

1. Tim Data Science menyiapkan dataset bersih dan definisi fitur.
2. AI Engineer menjalankan training model dari dataset harian.
   Missing value numerik pada script training ditangani dengan interpolasi linear berbasis urutan waktu.
3. Training menghasilkan artefak:
   - `models/energy_forecasting_lstm.keras`
   - `artifacts/minmax_scaler.joblib`
   - `artifacts/model_metadata.json`
   - `artifacts/metrics.json`
   - `logs/<run-id>/` untuk TensorBoard
4. Backend menjalankan FastAPI dan memuat artefak model.
5. Frontend mengirim minimal 30 data historis harian ke endpoint `/predict`.
6. Backend mengembalikan prediksi `Global_active_power`, estimasi kWh harian, dan estimasi biaya jika tarif dikirim.

## Command Utama

Install dependency:

```bash
pip install -r requirements.txt
```

Gunakan Google Colab atau Python 3.10/3.11 agar instalasi TensorFlow lebih aman.

Training dengan custom training loop `tf.GradientTape`:

```bash
PYTHONPATH=src python -m energy_forecasting.train --epochs 30 --batch-size 32 --loop custom
```

Training alternatif dengan `model.fit`, custom callback, dan TensorBoard:

```bash
PYTHONPATH=src python -m energy_forecasting.train --epochs 30 --batch-size 32 --loop keras
```

Menjalankan TensorBoard:

```bash
tensorboard --logdir logs
```

Menjalankan inference CLI:

```bash
PYTHONPATH=src python run_inference.py --csv household_daily_clean.csv
```

Menjalankan FastAPI:

```bash
PYTHONPATH=src uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger docs:

```text
http://localhost:8000/docs
```

## API Contract

Endpoint:

```http
POST /predict
```

Request body:

```json
{
  "records": [
    {
      "datetime": "2010-10-28",
      "Global_active_power": 1.2,
      "Global_reactive_power": 0.1,
      "Voltage": 240.0,
      "Global_intensity": 5.0,
      "Sub_metering_1": 1.0,
      "Sub_metering_2": 0.5,
      "Sub_metering_3": 8.0
    }
  ],
  "tariff_per_kwh": 1444.7
}
```

Catatan: `records` wajib berisi minimal 30 baris data historis harian. Contoh di atas hanya satu baris untuk memperlihatkan struktur field.

Response body:

```json
{
  "target": "Global_active_power",
  "next_date": "2010-11-27",
  "prediction_scaled": 0.32,
  "prediction_original": 1.15,
  "estimated_daily_kwh": 27.6,
  "estimated_daily_cost": 39873.72,
  "model_path": "models/energy_forecasting_lstm.keras"
}
```

## Integrasi Frontend

Frontend cukup membuat form atau dashboard yang:

- Mengambil 30 data historis terakhir dari backend/database.
- Mengirim data tersebut ke endpoint `/predict`.
- Menampilkan prediksi konsumsi listrik hari berikutnya.
- Opsional: menampilkan estimasi kWh dan estimasi biaya.

## Catatan Metrik Side Quest

Forecasting konsumsi listrik adalah masalah regresi, jadi metrik utama adalah MAE dan RMSE. Untuk kebutuhan "akurasi minimal 85%", hasil training juga menyimpan:

- `forecast_accuracy_from_mape`: pendekatan akurasi dari `1 - MAPE`.
- `within_10_percent_accuracy`: persentase prediksi yang masuk toleransi 10% dari nilai aktual.

## Catatan Generative AI

Generative AI hanya boleh dipakai sebagai fitur tambahan, bukan model utama. Contoh fitur aman:

- Membuat ringkasan insight dari hasil prediksi.
- Memberi saran hemat energi berdasarkan angka prediksi.
- Menjelaskan tren konsumsi dalam bahasa natural.

Implementasi endpoint Generative AI sebaiknya dilakukan setelah API forecasting stabil dan setelah tim menentukan provider serta API key yang digunakan.
