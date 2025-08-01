# The Database which we have right now is locally stored which is not done on a production level, but this is to show Proof of Concept of project
import time
import sqlite3
import pandas as pd
import numpy as np
import requests

def credit_score_factor(score : float): #Simple factoring method to calculate the premium amount
    if score >= 800:
        return 0.85
    elif score >= 750:
        return 0.90
    elif score >= 700:
        return 1.00
    elif score >= 650:
        return 1.10
    else:
        return 1.25

def prepare_user_data(df_row):
    try:
        df_row['Insured.sex_Male'] = 1 if df_row['Insured.sex'].iloc[0] == 'Male' else 0
        df_row['Marital_Single'] = 1 if df_row['Marital'].iloc[0] == 'Single' else 0
        df_row['Region_Urban'] = 1 if df_row['Region'].iloc[0] == 'Urban' else 0
        df_row.drop(columns=['Insured.sex', 'Marital', 'Region'], inplace=True)
        mapping = {
            'Commercial': 0,
            'Commute': 1,
            'Private': 2,
            'Farmer': 3
        }
        df_row['Car.use'] = df_row['Car.use'].map(mapping).astype('int64')

        df_row['mileage_ratio'] = df_row['Annual.miles.drive'] / (df_row['Car.age'] + 1)
        df_row['claims_per_year'] = df_row['NB_Claim'] / (df_row['Years.noclaims'] + 1)
        df_row['log_total_miles'] = np.log1p(df_row['Total.miles.driven'])

        df_final = df_row.apply(pd.to_numeric, errors='coerce')
        df_final.replace([np.inf, -np.inf], np.nan, inplace=True)
        df_final.fillna(-1, inplace=True)
        return df_final

    except Exception as e:
        print(f"Data preparation error: {e}")
        return None

def get_prediction_from_server(df_row: pd.DataFrame):
    df_final = df_row.drop(columns=['user_id'])
    data = df_final.iloc[0].to_dict()

    url = "http://127.0.0.1:8000/predict"

    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        prediction = response.json()
        pred_value = prediction["prediction"][0]
        df_row['Credit.score'] = pred_value
        return df_row

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None


class CreditScoreUpdater:
    def __init__(self):
        self.user_id_list = list(range(10001, 20001))
        self.db_path = "TelematicsCreditScore.db"
        self.data_table = "telematics_data"
        self.credit_table = "credit_score"

    def get_user_data_sqlite(self, user_id):
        try:
            conn = sqlite3.connect(self.db_path)

            query = f"SELECT * FROM {self.data_table} WHERE user_id = ?"
            df = pd.read_sql_query(query, conn, params=(user_id,))

            conn.close()

            if df.empty:
                print(f"No data found for user_id: {user_id}")
                return None

            return df

        except Exception as e:
            print(f"Database error: {e}")
            return None

    def update_credit_score(self, user_id, df_row):
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            credit_score = df_row["Credit.score"].iloc[0]
            factor = credit_score_factor(credit_score)
            premium = (15000 / 12) * factor # No vehicular data is available, so no differentiation between vehicles is being done
            cursor.execute(f"""
                        INSERT INTO {self.credit_table} (user_id, credit_score, premium)
                        VALUES (?, ?, ?)
                        ON CONFLICT(user_id) DO UPDATE SET credit_score=excluded.credit_score, premium = excluded.premium
                    """, (user_id, credit_score, premium))

            conn.commit()
            conn.close()
            print(f"Credit score for user_id {user_id} updated successfully.")

        except Exception as e:
            print(f"Database update error for user_id {user_id}: {e}")

    def run_periodic_update(self, sleep_time=3600): # default 1 hour
        while True:
            print("\n--- Starting update cycle ---")
            for user_id in self.user_id_list:
                df = self.get_user_data_sqlite(user_id)
                if df is not None:
                    prepared = prepare_user_data(df)
                    predicted = get_prediction_from_server(prepared)
                    if predicted is not None:
                        self.update_credit_score(user_id, predicted)
                        # time.sleep(0.25)
            print("Cycle complete. Sleeping...\n")
            time.sleep(sleep_time)

if __name__ == "__main__":
    updater = CreditScoreUpdater()
    updater.run_periodic_update(sleep_time=600)