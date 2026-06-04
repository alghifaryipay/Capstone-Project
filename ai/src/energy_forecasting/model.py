import tensorflow as tf
from tensorflow.keras import Model, layers


@tf.keras.utils.register_keras_serializable(package="EnergyForecasting")
class MovingAverageAnchor(layers.Layer):
    """Return the moving average of the target feature from the last N timesteps."""

    def __init__(self, target_col_index=0, average_window=7, **kwargs):
        super().__init__(**kwargs)
        self.target_col_index = target_col_index
        self.average_window = average_window

    def call(self, inputs):
        target_history = inputs[:, -self.average_window:, self.target_col_index]
        return tf.reduce_mean(target_history, axis=1, keepdims=True)

    def get_config(self):
        config = super().get_config()
        config.update(
            {
                "target_col_index": self.target_col_index,
                "average_window": self.average_window,
            }
        )
        return config


class TargetMAECallback(tf.keras.callbacks.Callback):
    """Stop training when the monitored MAE reaches a configured target."""

    def __init__(self, target_mae=0.02, monitor="val_mae"):
        super().__init__()
        self.target_mae = target_mae
        self.monitor = monitor

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        current_mae = logs.get(self.monitor)
        if current_mae is not None and current_mae <= self.target_mae:
            print(
                f"\nTarget {self.monitor} tercapai: "
                f"{current_mae:.4f} <= {self.target_mae:.4f}. Training dihentikan."
            )
            self.model.stop_training = True


def build_lstm_model(input_shape, learning_rate=0.001, target_col_index=0):
    inputs = layers.Input(shape=input_shape, name="input_window")
    anchor = MovingAverageAnchor(
        target_col_index=target_col_index,
        average_window=7,
        name="moving_average_anchor",
    )(inputs)

    x = layers.LSTM(32, return_sequences=False, name="lstm_encoder")(inputs)
    x = layers.Dropout(0.2, name="dropout")(x)
    x = layers.Dense(32, activation="relu", name="dense_projection")(x)
    residual = layers.Dense(
        1,
        kernel_initializer="zeros",
        bias_initializer="zeros",
        name="residual_output",
    )(x)
    outputs = layers.Add(name="forecast_output")([anchor, residual])

    model = Model(inputs=inputs, outputs=outputs, name="energy_forecasting_lstm")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
        loss=tf.keras.losses.Huber(),
        metrics=[tf.keras.metrics.MeanAbsoluteError(name="mae")],
    )
    return model
