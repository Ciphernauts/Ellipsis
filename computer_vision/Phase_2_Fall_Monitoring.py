import os
# import subprocess

# # Run all cells in the YOLO_Initialization_Commands.ipynb notebook
# subprocess.run(["jupyter", "nbconvert", "--to", "notebook", "--execute", "--inplace", "c:/Ellipsis/server/YOLO_Initialization_Commands.ipynb"])

from ultralytics import YOLO
from datetime import datetime
import psycopg2
import cv2

# Database credentials
db_host = "dpg-cvaugf2n91rc739bco30-a"
db_port = 5432
db_name = "ELLIPSIS"  # Replace with your database name
db_user = "ellipsis_user"  # Replace with your username
db_password = "ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak"  # Replace with your password

# const pool = new Pool({
#   //connectionString: 'postgresql://ellipsis_user:ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak@dpg-cvaugf2n91rc739bco30-a/ellipsis'
#   user: "ellipsis_user",
#   host: "dpg-cvaugf2n91rc739bco30-a",
#   database: "ellipsis",
#   password: "ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak",
#   port: 5432,
# });

# Initialize YOLO model
model = YOLO("computer_vision/best2.pt")  # Replace with your relative model path

def check_db_connection():
    """
    Checks if the connection to the database is successful.
    """
    try:
        conn = psycopg2.connect("postgresql://ellipsis_user:ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak@dpg-cvaugf2n91rc739bco30-a.singapore-postgres.render.com/ellipsis")
        cur = conn.cursor()
        cur.execute("SELECT 1")
        conn.close()
        print("Database connection successful.")
    except Exception as e:
        print(f"Database connection failed: {e}")

# Check database connection
check_db_connection()
print("Checked database connection.")

# Connect to PostgreSQL
conn = psycopg2.connect("postgresql://ellipsis_user:ffgJTH7dmIRWHgHcdFJLZBRUGR2Kc0Ak@dpg-cvaugf2n91rc739bco30-a.singapore-postgres.render.com/ellipsis")
cur = conn.cursor()
print("Connected to PostgreSQL.")

# # Create table if it doesn't exist
# cur.execute("""
# CREATE TABLE IF NOT EXISTS phase_2_detections (
#   frameID SERIAL PRIMARY KEY,  
#   Timestamp TIMESTAMP,    
#   Person INTEGER,
#   Helmet INTEGER,
#   No_Helmet INTEGER,
#   Harness INTEGER,
#   No_Harness INTEGER,
#   Scaffolding INTEGER,
#   Guardrail INTEGER,
# )
# """)
# conn.commit()
# print("Ensured table exists.")

def process_frame(frame):
    """
    Processes a single frame and updates the database with detection counts.

    Args:
        frame: The image frame to process.
    """
    results = model(frame)  # Run inference on the frame

    # Initialize counts for each class
    counts = {
        "Person": 0,
        "Helmet": 0,
        "No Helmet": 0,
        "Harness": 0,
        "No Harness": 0, 
        "Scaffolding": 0,
        "Guardrail": 0
    }

    # Count detected objects
    for result in results:
        for box in result.boxes:
            class_id = result.names[int(box.cls)]
            counts[class_id] += 1

    # Get current timestamp
    timestamp = datetime.now()

    # Insert data into the database
    cur.execute("""
    INSERT INTO phase_2_detections (Timestamp, Person, Helmet, No_Helmet, Harness, No_Harness, Scaffolding, Guardrail)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (timestamp, counts["Person"], counts["Helmet"], counts["No Helmet"], counts["Harness"], counts["No Harness"],
          counts["Scaffolding"], counts["Guardrail"]))
    conn.commit()
    print("Processed frame and updated database.")

# Directory containing the videos
video_directory = "computer_vision\Phase_2_Videos"

def get_video_files(directory):
    """
    Get a list of video files in the specified directory.

    Args:
        directory: The directory to search for video files.

    Returns:
        A list of video file paths.
    """
    video_files = []
    for file in os.listdir(directory):
        if file.endswith(".mp4"):  # Add other video file extensions if needed
            video_files.append(os.path.join(directory, file))
    return video_files

# Get the list of video files
video_files = get_video_files(video_directory)

while True:
    for video_path in video_files:
        cap = cv2.VideoCapture(video_path)
        print(f"Opened video file: {video_path}")

        while(cap.isOpened()):
            ret, frame = cap.read()
            if ret == True:
                process_frame(frame)
            else:
                break

        cap.release()
        print(f"Released video capture for: {video_path}")

# Close the database connection
cur.close()
conn.close()
print("Closed database connection.")