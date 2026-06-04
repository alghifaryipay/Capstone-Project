import argparse
from datetime import datetime

import numpy as np
import tensorflow as tf
from sklearn.metrics import mean_absolute_error, mean_squared_error

from .config import (
    DEFAULT_METADATA_PATH,
    DEFAULT_METRICS_PATH,
    DEFAULT_MODEL_PATH,
    DEFAULT_SCALER_PATH,
    LOG_DIR,
    MODEL_DIR,
    ARTIFACT_DIR,
    TARGET_COL,
    WINDOW_SIZE,
)
from .data import (
    inverse_transform_target,
    load_daily_dataset,
    make_tf_dataset,
    prepare_training_arrays,
    save_json,
    save_scaler,
    split_indices,
)
from .model import TargetMAECallback, build_lstm_model


def evaluate_baselines(df):
    _, val_end = split_indices(len(df))
    context = df.iloc[val_end - 7:].reset_index(drop=True)
    test_df = df.iloc[val_end:].reset_index(drop=True)

    y_true = test_df[TARGET_COL].to_numpy()
    naive_pred = context[TARGET_COL].shift(1).iloc[7:].to_numpy()
    ma7_pred = context[TARGET_COL].shift(1).rolling(window=7).mean().iloc[7:].to_numpy()

    return {
        "naive_forecast": {
            "mae": float(mean_absolute_error(y_true, naive_pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_true, naive_pred))),
        },
        "moving_average_7": {
            "mae": float(mean_absolute_error(y_true, ma7_pred)),
            "rmse": float(np.sqrt(mean_squared_error(y_true, ma7_pred))),
        },
    }


def evaluate_model(model, X, y, scaler, target_col_index, n_features):
    y_pred_scaled = model.predict(X, verbose=0).reshape(-1)
    y_scaled = y.reshape(-1)

    y_true_original = inverse_transform_target(scaler, y_scaled, target_col_index, n_features)
    y_pred_original = inverse_transform_target(scaler, y_pred_scaled, target_col_index, n_features)
    denominator = np.maximum(np.abs(y_true_original), 1e-8)
    mape = np.mean(np.abs(y_true_original - y_pred_original) / denominator)
    forecast_accuracy = max(0.0, 1.0 - float(mape))
    within_10_percent_accuracy = np.mean(
        np.abs(y_true_original - y_pred_original) <= (0.10 * denominator)
    )

    return {
        "mae_scaled": float(mean_absolute_error(y_scaled, y_pred_scaled)),
        "rmse_scaled": float(np.sqrt(mean_squared_error(y_scaled, y_pred_scaled))),
        "mae_original": float(mean_absolute_error(y_true_original, y_pred_original)),
        "rmse_original": float(np.sqrt(mean_squared_error(y_true_original, y_pred_original))),
        "mape_original": float(mape),
        "forecast_accuracy_from_mape": float(forecast_accuracy),
        "within_10_percent_accuracy": float(within_10_percent_accuracy),
    }


def run_custom_training_loop(
    model,
    train_ds,
    val_ds,
    epochs,
    learning_rate,
    target_mae,
    log_dir,
):
    optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
    loss_fn = tf.keras.losses.Huber()
    train_writer = tf.summary.create_file_writer(str(log_dir / "train"))
    val_writer = tf.summary.create_file_writer(str(log_dir / "validation"))
    history = []

    for epoch in range(1, epochs + 1):
        train_loss = tf.keras.metrics.Mean(name="train_loss")
        train_mae = tf.keras.metrics.MeanAbsoluteError(name="train_mae")
        val_loss = tf.keras.metrics.Mean(name="val_loss")
        val_mae = tf.keras.metrics.MeanAbsoluteError(name="val_mae")

        for X_batch, y_batch in train_ds:
            with tf.GradientTape() as tape:
                y_pred = tf.squeeze(model(X_batch, training=True), axis=-1)
                loss = loss_fn(y_batch, y_pred)

            gradients = tape.gradient(loss, model.trainable_variables)
            optimizer.apply_gradients(zip(gradients, model.trainable_variables))
            train_loss.update_state(loss)
            train_mae.update_state(y_batch, y_pred)

        for X_batch, y_batch in val_ds:
            y_pred = tf.squeeze(model(X_batch, training=False), axis=-1)
            loss = loss_fn(y_batch, y_pred)
            val_loss.update_state(loss)
            val_mae.update_state(y_batch, y_pred)

        epoch_result = {
            "epoch": epoch,
            "train_loss": float(train_loss.result().numpy()),
            "train_mae": float(train_mae.result().numpy()),
            "val_loss": float(val_loss.result().numpy()),
            "val_mae": float(val_mae.result().numpy()),
        }
        history.append(epoch_result)

        with train_writer.as_default():
            tf.summary.scalar("loss", epoch_result["train_loss"], step=epoch)
            tf.summary.scalar("mae", epoch_result["train_mae"], step=epoch)

        with val_writer.as_default():
            tf.summary.scalar("loss", epoch_result["val_loss"], step=epoch)
            tf.summary.scalar("mae", epoch_result["val_mae"], step=epoch)

        print(
            f"Epoch {epoch:03d}/{epochs} - "
            f"loss: {epoch_result['train_loss']:.4f} - "
            f"mae: {epoch_result['train_mae']:.4f} - "
            f"val_loss: {epoch_result['val_loss']:.4f} - "
            f"val_mae: {epoch_result['val_mae']:.4f}"
        )

        if epoch_result["val_mae"] <= target_mae:
            print(f"Target val_mae {target_mae:.4f} tercapai. Training dihentikan.")
            break

    return history


def parse_args():
    parser = argparse.ArgumentParser(description="Train energy forecasting LSTM model.")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=0.001)
    parser.add_argument("--target-mae", type=float, default=0.02)
    parser.add_argument("--loop", choices=["custom", "keras"], default="custom")
    parser.add_argument("--model-path", default=str(DEFAULT_MODEL_PATH))
    parser.add_argument("--scaler-path", default=str(DEFAULT_SCALER_PATH))
    parser.add_argument("--metadata-path", default=str(DEFAULT_METADATA_PATH))
    parser.add_argument("--metrics-path", default=str(DEFAULT_METRICS_PATH))
    return parser.parse_args()


def main():
    args = parse_args()
    tf.keras.utils.set_random_seed(42)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    run_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    log_dir = LOG_DIR / run_id

    df = load_daily_dataset()
    arrays, scaler, feature_cols, target_col_index, split_summary = prepare_training_arrays(
        df,
        window_size=WINDOW_SIZE,
    )

    train_ds = make_tf_dataset(arrays["X_train"], arrays["y_train"], args.batch_size, shuffle=True)
    val_ds = make_tf_dataset(arrays["X_val"], arrays["y_val"], args.batch_size, shuffle=False)

    model = build_lstm_model(
        input_shape=(arrays["X_train"].shape[1], arrays["X_train"].shape[2]),
        learning_rate=args.learning_rate,
        target_col_index=target_col_index,
    )

    baseline_metrics = evaluate_baselines(df)

    if args.loop == "custom":
        history = run_custom_training_loop(
            model=model,
            train_ds=train_ds,
            val_ds=val_ds,
            epochs=args.epochs,
            learning_rate=args.learning_rate,
            target_mae=args.target_mae,
            log_dir=log_dir,
        )
    else:
        tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=str(log_dir))
        history_obj = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=args.epochs,
            callbacks=[
                TargetMAECallback(target_mae=args.target_mae, monitor="val_mae"),
                tensorboard_callback,
            ],
        )
        history = [
            {"epoch": idx + 1, **{key: float(value[idx]) for key, value in history_obj.history.items()}}
            for idx in range(len(history_obj.history["loss"]))
        ]

    test_metrics = evaluate_model(
        model=model,
        X=arrays["X_test"],
        y=arrays["y_test"],
        scaler=scaler,
        target_col_index=target_col_index,
        n_features=len(feature_cols),
    )

    model.save(args.model_path)
    save_scaler(scaler, args.scaler_path)

    metadata = {
        "created_at": datetime.now().isoformat(timespec="seconds"),
        "model_name": model.name,
        "model_path": args.model_path,
        "scaler_path": args.scaler_path,
        "missing_value_strategy": "linear_interpolation_then_ffill_bfill",
        "window_size": WINDOW_SIZE,
        "target_col": TARGET_COL,
        "target_col_index": target_col_index,
        "feature_cols": feature_cols,
        "split_summary": split_summary,
        "training_loop": args.loop,
        "tensorboard_log_dir": str(log_dir),
    }

    metrics = {
        "baseline": baseline_metrics,
        "model": test_metrics,
        "target_accuracy": 0.85,
        "target_mae_scaled": args.target_mae,
        "meets_accuracy_from_mape": bool(test_metrics["forecast_accuracy_from_mape"] >= 0.85),
        "meets_within_10_percent_accuracy": bool(test_metrics["within_10_percent_accuracy"] >= 0.85),
        "meets_target_mae_scaled": bool(test_metrics["mae_scaled"] <= args.target_mae),
        "history": history,
    }

    save_json(metadata, args.metadata_path)
    save_json(metrics, args.metrics_path)

    print("\nTraining selesai.")
    print(f"Model tersimpan di: {args.model_path}")
    print(f"Scaler tersimpan di: {args.scaler_path}")
    print(f"Metadata tersimpan di: {args.metadata_path}")
    print(f"Metrics tersimpan di: {args.metrics_path}")
    print(f"TensorBoard log dir: {log_dir}")
    print(f"Test MAE scaled: {test_metrics['mae_scaled']:.4f}")
    print(f"Test MAE original: {test_metrics['mae_original']:.4f}")


if __name__ == "__main__":
    main()
