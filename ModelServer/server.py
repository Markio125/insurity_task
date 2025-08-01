from fastapi import FastAPI
import pandas as pd
from pydantic import BaseModel
from typing import Dict, Any
import pickle
import numpy as np
from xgboost import XGBRegressor
import uvicorn

with open("insurity_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Server is running"}

@app.post("/predict")
def predict(input_data: Dict[str, Any]):
    df = pd.DataFrame([input_data])
    prediction = model.predict(df)
    return {"prediction": prediction.tolist()}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
