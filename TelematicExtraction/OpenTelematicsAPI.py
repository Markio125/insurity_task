import requests
import psycopg2
import os
from datetime import datetime
import time
import json

class DBUpdate:
    def __init__(self, json_path = "user_id.json"):
        self.json_path = os.path.join(os.path.dirname(__file__), json_path)
        self.load_user_ids()
        self.running = True
        self.api_url = os.getenv("TELEMATICS_API_URL")
        self.api_key = os.getenv("TELEMATICS_API_KEY")
        self.db_host = os.getenv("TELEMATICS_API_URL")
        self.db_port = "5432"
        self.db_name = "DB_main"
        self.db_user = os.getenv("DB_user")
        self.db_pass = os.getenv("DB_password")
        self.user_dict = {}

    def fetch_user_telematics(self, user_id):
        params = {"user_id": user_id}
        headers = {"Authorization": f"Bearer {self.api_key}"}
        resp = requests.get(self.api_url, params=params, headers=headers)
        resp.raise_for_status()
        return resp.json()

    # this function updates the existing rows of the 100 people whose data is being stored in the database
    # either as a cumulative method or by weighted average. All relevant features may not be covered due to limitations
    # of the API being considered (Damoov), also no API is provided due to it being a paid service. Damoov is
    # only being used as a template API, it can be replaced with anything else.

    def save_telematics_to_db(self, user_id, data):
        conn = psycopg2.connect(
            host=self.db_host, port=self.db_port, dbname=self.db_name,
            user=self.db_user, password=self.db_pass)
        cur = conn.cursor()

        # Extract features
        distance = data.get("distance", 0)
        time_delta = data.get("duration", 0)
        speed = data.get("speed", 0)
        accel_x = data.get("accel", {}).get("x", 0)
        accel_y = data.get("accel", {}).get("y", 0)
        accel_z = data.get("accel", {}).get("z", 0)
        accel_count = data.get("accel_count", 0)
        brake_count = data.get("brake_count", 0)
        left_turn_intensity = data.get("left_turn_intensity", 0)
        right_turn_intensity = data.get("right_turn_intensity", 0)
        weekday_pct = data.get("weekday_driving_pct", 0)
        if weekday_pct > 1: weekday_pct /= 100
        weekend_pct = data.get("weekend_driving_pct", 0)
        if weekend_pct > 1: weekend_pct /= 100
        rush_pct = data.get("rush_hour_driving_pct", 0)
        if rush_pct > 1: rush_pct /= 100

        cur.execute("""
            INSERT INTO telematics_logs (
                user_id, total_distance, total_time, avg_speed,
                avg_accel_x, avg_accel_y, avg_accel_z,
                accel_count, brake_count,
                left_turn_intensity, right_turn_intensity,
                weekday_driving_pct, weekend_driving_pct, rush_hour_driving_pct,
                data_points
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
            ON CONFLICT (user_id) DO UPDATE SET
                total_distance = telematics_logs.total_distance + EXCLUDED.total_distance,
                total_time = telematics_logs.total_time + EXCLUDED.total_time,
                accel_count = telematics_logs.accel_count + EXCLUDED.accel_count,
                brake_count = telematics_logs.brake_count + EXCLUDED.brake_count,
                data_points = telematics_logs.data_points + 1,
                avg_speed = (
                    (telematics_logs.avg_speed * telematics_logs.data_points + EXCLUDED.avg_speed)
                    / (telematics_logs.data_points + 1)
                ),
                avg_accel_x = (
                    (telematics_logs.avg_accel_x * telematics_logs.data_points + EXCLUDED.avg_accel_x)
                    / (telematics_logs.data_points + 1)
                ),
                avg_accel_y = (
                    (telematics_logs.avg_accel_y * telematics_logs.data_points + EXCLUDED.avg_accel_y)
                    / (telematics_logs.data_points + 1)
                ),
                avg_accel_z = (
                    (telematics_logs.avg_accel_z * telematics_logs.data_points + EXCLUDED.avg_accel_z)
                    / (telematics_logs.data_points + 1)
                ),
                left_turn_intensity = (
                    (telematics_logs.left_turn_intensity * telematics_logs.data_points + EXCLUDED.left_turn_intensity)
                    / (telematics_logs.data_points + 1)
                ),
                right_turn_intensity = (
                    (telematics_logs.right_turn_intensity * telematics_logs.data_points + EXCLUDED.right_turn_intensity)
                    / (telematics_logs.data_points + 1)
                ),
                weekday_driving_pct = (
                    (telematics_logs.weekday_driving_pct * telematics_logs.data_points + EXCLUDED.weekday_driving_pct)
                    / (telematics_logs.data_points + 1)
                ),
                weekend_driving_pct = (
                    (telematics_logs.weekend_driving_pct * telematics_logs.data_points + EXCLUDED.weekend_driving_pct)
                    / (telematics_logs.data_points + 1)
                ),
                rush_hour_driving_pct = (
                    (telematics_logs.rush_hour_driving_pct * telematics_logs.data_points + EXCLUDED.rush_hour_driving_pct)
                    / (telematics_logs.data_points + 1)
                )
        """, (
            user_id, distance, time_delta, speed,
            accel_x, accel_y, accel_z,
            accel_count, brake_count,
            left_turn_intensity, right_turn_intensity,
            weekday_pct, weekend_pct, rush_pct
        ))

        conn.commit()
        cur.close()
        conn.close()

        if user_id not in self.user_dict:
            self.user_dict[user_id] = {}
            self.user_dict[user_id]["Update Count"] = 0
        self.user_dict[user_id]["last_updated"] = datetime.now().isoformat()
        self.user_dict[user_id]["Update Count"] += 1

    def poll_and_store_batch(self):
        for user_id in self.user_dict.keys():
            try:
                data = self.fetch_user_telematics(user_id)
                self.save_telematics_to_db(user_id, data)
                print(f"Saved data for {user_id}")
            except Exception as e:
                print(f"Error for {user_id}: {e}")

    def load_user_ids(self):
        if os.path.exists(self.json_path):
            with open(self.json_path, "r") as f:
                self.user_dict = json.load(f)
        else:
            self.user_dict = {}

    def save_user_ids(self):
        with open(self.json_path, "w") as f:
            json.dump(self.user_dict, f, indent=2)

    def run(self):
        try:
            while self.running:
                print(f"📦 Starting batch poll at {datetime.now().isoformat()}")
                self.poll_and_store_batch()
                print("Sleeping for 5 minutes...")
                time.sleep(5 * 60)
        except KeyboardInterrupt:
            print("Stopping gracefully (Ctrl+C detected)...")
        finally:
            self.save_user_ids()
            print("User IDs saved to user_id.json")

if __name__ == "__main__":
    updater = DBUpdate()
    updater.run()

"""      
Below is the format of the database being stored in (All relevant telematic features may not be present in the given API)

CREATE TABLE telematics_logs (
    user_id VARCHAR PRIMARY KEY,
    total_distance FLOAT DEFAULT 0,
    total_time FLOAT DEFAULT 0,
    avg_speed FLOAT DEFAULT 0,
    avg_accel_x FLOAT DEFAULT 0,
    avg_accel_y FLOAT DEFAULT 0,
    avg_accel_z FLOAT DEFAULT 0,
    accel_count INT DEFAULT 0,
    brake_count INT DEFAULT 0,
    left_turn_intensity FLOAT DEFAULT 0,
    right_turn_intensity FLOAT DEFAULT 0,
    weekday_driving_pct FLOAT DEFAULT 0,
    weekend_driving_pct FLOAT DEFAULT 0,
    rush_hour_driving_pct FLOAT DEFAULT 0,
    data_points INT DEFAULT 0
);
"""