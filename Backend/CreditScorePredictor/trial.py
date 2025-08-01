import sqlite3
import pandas as pd

df = pd.read_csv("../../ModelTraining/historical+telematic_data.csv")
df_col = df['Credit.score']

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

def update_credit_score(df_col):
    for user_id in range(10001, 90001):
        try:
            conn = sqlite3.connect("TelematicsCreditScore.db")
            cursor = conn.cursor()
            credit_score = df_col.iloc[user_id-10001]
            factor = credit_score_factor(credit_score)
            premium = (15000 / 12) * factor  # No vehicular data is available, so no differentiation between vehicles is being done
            cursor.execute(f"""
                        INSERT INTO credit_score (user_id, credit_score, premium)
                        VALUES (?, ?, ?)
                        ON CONFLICT(user_id) DO UPDATE SET credit_score=excluded.credit_score, premium = excluded.premium
                    """, (user_id, credit_score, premium))

            conn.commit()
            conn.close()
            print(f"Credit score for user_id {user_id} updated successfully.")

        except Exception as e:
            print(f"Database update error for user_id {user_id}: {e}")

update_credit_score(df_col)