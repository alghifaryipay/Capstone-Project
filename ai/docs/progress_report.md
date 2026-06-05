# Progress Report AI Engineer

## Status Main Quest

Main quest sudah terpenuhi secara teknis:

- Model Deep Learning dibuat sendiri dengan TensorFlow.
- Model menggunakan TensorFlow Keras Functional API.
- Arsitektur model memakai LSTM dengan custom layer `MovingAverageAnchor`.
- Custom component tersedia:
  - Custom Layer: `MovingAverageAnchor`
  - Custom Callback: `TargetMAECallback`
- Model tersimpan dalam format `.keras`.
- Kode inference tersedia melalui CLI dan FastAPI.
- Tidak menggunakan TensorFlow Hub, AutoML, atau layanan API eksternal sebagai model utama.

## Status Side Quest

Side quest yang sudah dicoba:

- REST API mandiri menggunakan FastAPI.
- Custom training loop menggunakan `tf.GradientTape`.
- TensorBoard logging.
- Metrik tambahan untuk kebutuhan akurasi forecasting.

Side quest yang belum diimplementasikan penuh:

- Integrasi Generative AI. Ini sengaja belum dijadikan fitur utama karena hanya boleh menjadi fitur tambahan, bukan model prediksi utama.

## Hasil Run Lokal

Environment:

- Python 3.11 virtual environment melalui `uv`
- TensorFlow 2.21.0
- Training berjalan di CPU karena GPU/CUDA tidak tersedia

Final model utama:

- Model: `models/energy_forecasting_lstm.keras`
- Training mode: Keras `model.fit`
- Epoch: 30
- Test MAE scaled: 0.0545
- Test MAE original: 0.1712
- Forecast accuracy from MAPE: 0.7957

Bukti custom loop:

- Model: `models/energy_forecasting_lstm_custom.keras`
- Training mode: custom loop `tf.GradientTape`
- Epoch: 3
- Test MAE scaled: 0.0553
- Test MAE original: 0.1736

## Catatan Target Side Quest

Target side quest `akurasi 85%` dan `MAE 0.02` belum tercapai pada run lokal. Ini sudah dicatat jujur di file metrics:

- `artifacts/metrics.json`
- `artifacts/metrics_custom_loop.json`

Untuk mengejar target tersebut, tahap berikutnya perlu tuning tambahan seperti eksperimen GRU, bidirectional LSTM, learning rate schedule, fitur kalender, window size berbeda, atau evaluasi target dalam skala yang disepakati tim.

## Status Integrasi

Inference CLI berhasil:

```bash
PYTHONPATH=src .venv/bin/python run_inference.py --csv household_daily_clean.csv --tariff-per-kwh 1444.7
```

FastAPI endpoint berhasil dites:

- `GET /health`
- `POST /predict`

Frontend dapat mengirim minimal 30 record historis harian ke `/predict`, lalu menampilkan hasil prediksi `Global_active_power`, estimasi kWh harian, dan estimasi biaya.
