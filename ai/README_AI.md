# AI Engineer Progress - Energy Forecasting

Project ini berfokus pada prediksi konsumsi listrik rumah tangga dengan target `Global_active_power`.

## Progress Saat Ini

Fondasi AI pipeline sudah tersedia melalui notebook awal:

- Data understanding untuk dataset daily dan monthly.
- Split train-validation-test berbasis waktu.
- Baseline naive forecast dan moving average 7 hari.
- Missing value pada script training ditangani dengan interpolasi linear setelah data diurutkan berdasarkan waktu.
- Scaling dengan `MinMaxScaler`.
- Windowing 30 hari untuk input LSTM/GRU.
- Skeleton model TensorFlow Functional API.
- Skeleton custom callback.

Tambahan untuk main quest dan side quest sudah disiapkan dalam bentuk script modular:

- Model LSTM TensorFlow Functional API.
- Custom callback `TargetMAECallback`.
- Export model ke `.keras`.
- Save scaler dan metadata.
- Inference CLI.
- REST API FastAPI.
- Custom training loop dengan `tf.GradientTape`.
- TensorBoard logging.
- Metrik side quest: MAE scaled, RMSE, forecast accuracy berbasis MAPE, dan akurasi dalam toleransi 10%.

## Cara Menjalankan

Install dependency:

```bash
pip install -r requirements.txt
```

Disarankan memakai Google Colab atau Python 3.10/3.11 untuk kompatibilitas TensorFlow.

Training side quest dengan custom loop:

```bash
PYTHONPATH=src python -m energy_forecasting.train --epochs 30 --batch-size 32 --loop custom
```

Jalankan TensorBoard:

```bash
tensorboard --logdir logs
```

Inference CLI:

```bash
PYTHONPATH=src python run_inference.py --csv household_daily_clean.csv
```

FastAPI:

```bash
PYTHONPATH=src uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Dokumentasi API tersedia di:

```text
http://localhost:8000/docs
```

## Integrasi BE/FE

Backend menjalankan FastAPI dan memuat artefak model dari folder `models/` dan `artifacts/`. Frontend mengirim minimal 30 data historis harian ke endpoint `/predict`, lalu menampilkan hasil prediksi konsumsi listrik, estimasi kWh, dan estimasi biaya.

Detail kontrak integrasi ada di `docs/fullstack_integration.md`.
Ringkasan hasil run lokal ada di `docs/progress_report.md`.

## Catatan Metrik

Karena kasus ini adalah time-series regression, metrik utama tetap MAE/RMSE. Jika diminta "akurasi minimal 85%", script training menyimpan dua pendekatan yang lebih cocok untuk forecasting:

- `forecast_accuracy_from_mape`: dihitung dari `1 - MAPE`.
- `within_10_percent_accuracy`: persentase prediksi yang berada dalam toleransi error 10% dari nilai aktual.
