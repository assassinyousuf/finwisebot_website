from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import numpy as np
from .model import simple_predict

class PredictRequest(BaseModel):
    symbol: Optional[str]
    history: List[float]

class PredictResponse(BaseModel):
    symbol: Optional[str]
    prediction: float
    metadata: dict

app = FastAPI(title="ML Inference Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if not payload.history:
        raise HTTPException(status_code=400, detail="history must be a non-empty array of numbers")
    pred, meta = simple_predict(payload.history)
    return PredictResponse(symbol=payload.symbol, prediction=float(pred), metadata=meta)
