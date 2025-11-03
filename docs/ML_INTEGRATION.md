# ML Integration — run & test

Quick steps to run the new microservice and try the end-to-end flow.

1) Run the ML microservice

```pwsh
cd ml_service
python -m venv .venv
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Service will be available at http://localhost:8000. Try `http://localhost:8000/health`.

2) Start the Next.js app (from repo root)

```pwsh
# from repo root
npm install
npm run dev
```

3) Use the Prediction widget
- Open the demo page at `http://localhost:3000/demo` and try the prediction widget embedded there.
- Submit a small history like `100,101,102` — in the frontend demo this uses a local mock predictor. Reintroduce the ML proxy route and microservice if you restore the backend.

4) Direct test via curl (if ML service running):

```pwsh
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d '{"symbol":"AAPL","history":[100,101,102]}'
```

5) Notes
- The ML service here is a lightweight synthetic model for demo. Replace `ml_service/app/model.py` with real model-loading code and weights when ready.
- Configure `ML_SERVICE_URL` in your Next.js `.env.local` if the ML service is remote.
