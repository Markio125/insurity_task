import sqlite3
import pandas as pd

# Connect to the database
conn = sqlite3.connect("TelematicsCreditScore.db")
cursor = conn.cursor()
query = "SELECT * FROM telematics_data WHERE user_id = ?"
cursor.execute(query, (10011,))
columns = [description[0] for description in cursor.description]
result = cursor.fetchone()
user_data = dict(zip(columns, result))
print(user_data)
# Define the query
query = "SELECT * FROM credit_score WHERE user_id = ?"

# Run the query and load into a DataFrame
df_user = pd.read_sql_query(query, conn, params=(10011,))

# Close the connection
conn.close()

# Display the extracted row
print(df_user)
