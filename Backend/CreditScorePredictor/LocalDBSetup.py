import pandas as pd
import sqlite3

conn = sqlite3.connect("TelematicsCreditScore.db")
df = pd.read_csv("historical+telematic_data(cleaned).csv")
df["user_id"] = range(10001, 10001 + len(df))

df.to_sql("telematics_data", conn, if_exists="replace", index=False)
with conn:
    conn.execute("""
        DROP TABLE IF EXISTS credit_score;
    """)

    conn.execute("""
    CREATE TABLE credit_score(
        user_id INTEGER PRIMARY KEY,
        credit_score FLOAT,
        premium FLOAT
    )
    """)
conn.close()