import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

from .config import DATETIME_COL, DAILY_CSV_PATH, TARGET_COL, WINDOW_SIZE


def load_daily_dataset(path=DAILY_CSV_PATH):
    df = pd.read_csv(path)
    if DATETIME_COL not in df.columns:
        raise ValueError(f"Kolom {DATETIME_COL!r} tidak ditemukan.")

    df[DATETIME_COL] = pd.to_datetime(df[DATETIME_COL])
    df = df.sort_values(DATETIME_COL).reset_index(drop=True)
    df = handle_missing_values(df)
    return df


def handle_missing_values(df):
    numeric_cols = [col for col in df.columns if col != DATETIME_COL]
    df[numeric_cols] = (
        df[numeric_cols]
        .interpolate(method="linear", limit_direction="both")
        .ffill()
        .bfill()
    )
    return df


def get_feature_columns(df):
    return [col for col in df.columns if col != DATETIME_COL]


def split_indices(n_rows, train_ratio=0.70, val_ratio=0.15):
    train_end = int(n_rows * train_ratio)
    val_end = int(n_rows * (train_ratio + val_ratio))
    return train_end, val_end


def create_windows(data, window_size=WINDOW_SIZE, target_col_index=0):
    X = []
    y = []
    target_positions = []

    for target_pos in range(window_size, len(data)):
        X.append(data[target_pos - window_size:target_pos, :])
        y.append(data[target_pos, target_col_index])
        target_positions.append(target_pos)

    return (
        np.asarray(X, dtype=np.float32),
        np.asarray(y, dtype=np.float32),
        np.asarray(target_positions),
    )


def prepare_training_arrays(df, window_size=WINDOW_SIZE):
    feature_cols = get_feature_columns(df)
    target_col_index = feature_cols.index(TARGET_COL)
    train_end, val_end = split_indices(len(df))

    scaler = MinMaxScaler()
    scaler.fit(df.iloc[:train_end][feature_cols])

    scaled_all = scaler.transform(df[feature_cols])
    X_all, y_all, target_positions = create_windows(
        scaled_all,
        window_size=window_size,
        target_col_index=target_col_index,
    )

    train_mask = target_positions < train_end
    val_mask = (target_positions >= train_end) & (target_positions < val_end)
    test_mask = target_positions >= val_end

    arrays = {
        "X_train": X_all[train_mask],
        "y_train": y_all[train_mask],
        "X_val": X_all[val_mask],
        "y_val": y_all[val_mask],
        "X_test": X_all[test_mask],
        "y_test": y_all[test_mask],
    }

    split_summary = {
        "train": {
            "rows": int(train_end),
            "start": str(df.iloc[:train_end][DATETIME_COL].min().date()),
            "end": str(df.iloc[:train_end][DATETIME_COL].max().date()),
        },
        "validation": {
            "rows": int(val_end - train_end),
            "start": str(df.iloc[train_end:val_end][DATETIME_COL].min().date()),
            "end": str(df.iloc[train_end:val_end][DATETIME_COL].max().date()),
        },
        "test": {
            "rows": int(len(df) - val_end),
            "start": str(df.iloc[val_end:][DATETIME_COL].min().date()),
            "end": str(df.iloc[val_end:][DATETIME_COL].max().date()),
        },
    }

    return arrays, scaler, feature_cols, target_col_index, split_summary


def make_tf_dataset(X, y, batch_size=32, shuffle=False):
    dataset = tf.data.Dataset.from_tensor_slices((X.astype(np.float32), y.astype(np.float32)))
    if shuffle:
        dataset = dataset.shuffle(buffer_size=len(X), seed=42, reshuffle_each_iteration=True)
    return dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def inverse_transform_target(scaler, values, target_col_index, n_features):
    values = np.asarray(values).reshape(-1)
    placeholder = np.zeros((len(values), n_features), dtype=np.float32)
    placeholder[:, target_col_index] = values
    return scaler.inverse_transform(placeholder)[:, target_col_index]


def save_json(data, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2))


def save_scaler(scaler, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(scaler, path)


def load_scaler(path):
    return joblib.load(path)
