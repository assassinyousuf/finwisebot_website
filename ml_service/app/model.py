from typing import Tuple, List
import numpy as np


def simple_predict(history: List[float]) -> Tuple[float, dict]:
    """A tiny synthetic predictor for demo purposes.

    It returns the last value adjusted by a small random drift based on recent volatility.
    """
    arr = np.array(history, dtype=float)
    last = float(arr[-1])
    vol = float(np.std(arr[-10:]) if arr.size >= 2 else 0.0)
    # synthetic drift proportional to a tiny fraction of volatility
    noise = np.random.normal(loc=0.0, scale=max(1e-6, vol * 0.01))
    pred = last * (1.0 + noise)
    meta = {"model": "synthetic-demo-v1", "volatility": vol}
    return pred, meta
