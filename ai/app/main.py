import sys
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from energy_forecasting.config import DEFAULT_METADATA_PATH, DEFAULT_MODEL_PATH, DEFAULT_SCALER_PATH
from energy_forecasting.inference import EnergyForecaster


app = FastAPI(
    title="Energy Forecasting API",
    description="REST API untuk inference model prediksi konsumsi listrik rumah tangga.",
    version="1.0.0",
)

forecaster = None
startup_error = None


class EnergyRecord(BaseModel):
    datetime: Optional[str] = None
    Global_active_power: float
    Global_reactive_power: float
    Voltage: float
    Global_intensity: float
    Sub_metering_1: float
    Sub_metering_2: float
    Sub_metering_3: float


class PredictionRequest(BaseModel):
    records: list[EnergyRecord] = Field(
        ...,
        min_length=30,
        description="Minimal 30 baris data historis harian berurutan.",
    )
    tariff_per_kwh: Optional[float] = Field(
        default=None,
        description="Opsional. Tarif listrik per kWh untuk estimasi biaya harian.",
    )


class PredictionResponse(BaseModel):
    target: str
    next_date: Optional[str]
    prediction_scaled: float
    prediction_original: float
    estimated_daily_kwh: float
    estimated_daily_cost: Optional[float]
    model_path: str


def _record_to_dict(record):
    if hasattr(record, "model_dump"):
        return record.model_dump()
    return record.dict()


def get_forecaster():
    global forecaster, startup_error
    if forecaster is not None:
        return forecaster

    try:
        forecaster = EnergyForecaster(
            model_path=DEFAULT_MODEL_PATH,
            scaler_path=DEFAULT_SCALER_PATH,
            metadata_path=DEFAULT_METADATA_PATH,
        )
        startup_error = None
        return forecaster
    except FileNotFoundError as exc:
        startup_error = str(exc)
        raise


@app.get("/health")
def health():
    model_ready = (
        DEFAULT_MODEL_PATH.exists()
        and DEFAULT_SCALER_PATH.exists()
        and DEFAULT_METADATA_PATH.exists()
    )
    return {
        "status": "ok",
        "model_ready": model_ready,
        "model_path": str(DEFAULT_MODEL_PATH),
        "scaler_path": str(DEFAULT_SCALER_PATH),
        "metadata_path": str(DEFAULT_METADATA_PATH),
        "startup_error": startup_error,
    }


@app.get("/model/info")
def model_info():
    try:
        loaded_forecaster = get_forecaster()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return loaded_forecaster.metadata


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    try:
        loaded_forecaster = get_forecaster()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    records = [_record_to_dict(record) for record in payload.records]
    input_df = pd.DataFrame(records)

    try:
        return loaded_forecaster.predict_next_day(
            input_df,
            tariff_per_kwh=payload.tariff_per_kwh,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
