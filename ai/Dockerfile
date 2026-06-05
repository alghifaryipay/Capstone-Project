FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TF_CPP_MIN_LOG_LEVEL=2

WORKDIR /app

RUN useradd --create-home appuser

COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY app ./app
COPY src ./src
COPY models/energy_forecasting_lstm.keras ./models/energy_forecasting_lstm.keras
COPY artifacts/minmax_scaler.joblib ./artifacts/minmax_scaler.joblib
COPY artifacts/model_metadata.json ./artifacts/model_metadata.json

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
