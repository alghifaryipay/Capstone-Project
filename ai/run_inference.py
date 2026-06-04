import argparse
import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from energy_forecasting.inference import predict_from_csv


def parse_args():
    parser = argparse.ArgumentParser(description="Run one-step energy forecasting inference.")
    parser.add_argument("--csv", default="household_daily_clean.csv")
    parser.add_argument("--tariff-per-kwh", type=float, default=None)
    return parser.parse_args()


def main():
    args = parse_args()
    result = predict_from_csv(args.csv, tariff_per_kwh=args.tariff_per_kwh)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
