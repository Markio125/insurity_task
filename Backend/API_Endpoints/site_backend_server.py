from fastapi import FastAPI
import uvicorn
import sqlite3

db_path = "../CreditScorePredictor/TelematicsCreditScore.db"
app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "API Endpoint Server is Active"}

@app.get("/user_credit_info/{user_id}")
def get_user_credit_info(user_id: int):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        query = "SELECT credit_score, premium FROM credit_score WHERE user_id = ?"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        conn.close()

        if result:
            credit_score, premium = result
            return {
                "user_id": user_id,
                "credit_score": credit_score,
                "premium": premium
            }
        else:
            return {"message": f"user_id {user_id} does not exist in the credit_score table."}

    except Exception as e:
        return {"error": str(e)}

@app.get("/user_telematics_info/{user_id}")
def get_user_telematics_info(user_id: int):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        query = "SELECT * FROM telematics_data WHERE user_id = ?"
        cursor.execute(query, (user_id,))
        columns = [description[0] for description in cursor.description]
        result = cursor.fetchone()

        conn.close()

        if result:
            user_data = dict(zip(columns, result))
            return user_data
        else:
            return {"message": f"user_id {user_id} does not exist in the telematics_data table."}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("site_backend_server:app", host="127.0.0.2", port=8080, reload=True)