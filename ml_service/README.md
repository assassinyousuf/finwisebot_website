# ML Inference Microservice (FastAPI)

This is a minimal FastAPI scaffold that provides a /predict endpoint for demoing model inference.

Run locally (Python 3.11+ recommended):

```pwsh
# create and activate venv
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The service exposes:
- `GET /health` - simple health check
- `POST /predict` - accepts JSON {"symbol": "XXX", "history": [<numbers>]} and returns a synthetic prediction JSON.

This scaffold uses a tiny synthetic model so it runs without heavy ML deps.

To deploy, build the Dockerfile in this folder and run the container; see `Dockerfile`.
