import json
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf

from .config import (
    DATETIME_COL,
    DEFAULT_METADATA_PATH,
    DEFAULT_MODEL_PATH,
    DEFAULT_SCALER_PATH,
    TARGET_COL,
)
from .data import inverse_transform_target, load_scaler
from . import model as _model_module


class EnergyForecaster:
    def __init__(
        self,
        model_path=DEFAULT_MODEL_PATH,
        scaler_path=DEFAULT_SCALER_PATH,
        metadata_path=DEFAULT_METADATA_PATH,
    ):
        self.model_path = Path(model_path)
        self.scaler_path = Path(scaler_path)
        self.metadata_path = Path(metadata_path)

        missing_paths = [
            str(path)
            for path in [self.model_path, self.scaler_path, self.metadata_path]
            if not path.exists()
        ]
        if missing_paths:
            raise FileNotFoundError(
                "Artefak model belum lengkap. Jalankan training terlebih dahulu. "
                f"Missing: {missing_paths}"
            )

        self.model = tf.keras.models.load_model(self.model_path, compile=False)
        self.scaler = load_scaler(self.scaler_path)
        self.metadata = json.loads(self.metadata_path.read_text())
        self.feature_cols = self.metadata["feature_cols"]
        self.window_size = int(self.metadata["window_size"])
        self.target_col_index = int(self.metadata["target_col_index"])

    def _prepare_window(self, df):
        df = df.copy()
        if DATETIME_COL in df.columns and df[DATETIME_COL].notna().all():
            df[DATETIME_COL] = pd.to_datetime(df[DATETIME_COL])
            df = df.sort_values(DATETIME_COL).reset_index(drop=True)

        missing_cols = [col for col in self.feature_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Kolom fitur belum lengkap: {missing_cols}")

        if len(df) < self.window_size:
            raise ValueError(
                f"Butuh minimal {self.window_size} baris data historis, "
                f"tetapi hanya menerima {len(df)} baris."
            )

        latest_window = df.tail(self.window_size)
        scaled_window = self.scaler.transform(latest_window[self.feature_cols])
        X = scaled_window.reshape(1, self.window_size, len(self.feature_cols)).astype(np.float32)

        next_date = None
        if DATETIME_COL in latest_window.columns and latest_window[DATETIME_COL].notna().all():
            next_date = str((latest_window[DATETIME_COL].max() + pd.Timedelta(days=1)).date())

        return X, next_date

    def predict_next_day(self, df, tariff_per_kwh=None):
        X, next_date = self._prepare_window(df)
        prediction_scaled = float(self.model.predict(X, verbose=0).reshape(-1)[0])
        prediction_original = float(
            inverse_transform_target(
                self.scaler,
                [prediction_scaled],
                self.target_col_index,
                len(self.feature_cols),
            )[0]
        )

        estimated_daily_kwh = prediction_original * 24
        estimated_daily_cost = None
        if tariff_per_kwh is not None:
            estimated_daily_cost = estimated_daily_kwh * float(tariff_per_kwh)

        return {
            "target": TARGET_COL,
            "next_date": next_date,
            "prediction_scaled": prediction_scaled,
            "prediction_original": prediction_original,
            "estimated_daily_kwh": estimated_daily_kwh,
            "estimated_daily_cost": estimated_daily_cost,
            "model_path": str(self.model_path),
        }


def predict_from_csv(csv_path, tariff_per_kwh=None):
    forecaster = EnergyForecaster()
    df = pd.read_csv(csv_path)
    return forecaster.predict_next_day(df, tariff_per_kwh=tariff_per_kwh)
