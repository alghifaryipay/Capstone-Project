from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = ROOT_DIR
MODEL_DIR = ROOT_DIR / "models"
ARTIFACT_DIR = ROOT_DIR / "artifacts"
LOG_DIR = ROOT_DIR / "logs"

DAILY_CSV_PATH = DATA_DIR / "household_daily_clean.csv"
MONTHLY_CSV_PATH = DATA_DIR / "household_monthly_clean.csv"

DATETIME_COL = "datetime"
TARGET_COL = "Global_active_power"
WINDOW_SIZE = 30

DEFAULT_MODEL_PATH = MODEL_DIR / "energy_forecasting_lstm.keras"
DEFAULT_SCALER_PATH = ARTIFACT_DIR / "minmax_scaler.joblib"
DEFAULT_METADATA_PATH = ARTIFACT_DIR / "model_metadata.json"
DEFAULT_METRICS_PATH = ARTIFACT_DIR / "metrics.json"
