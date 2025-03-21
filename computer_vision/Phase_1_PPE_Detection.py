import os
# import subprocess

# # Run all cells in the YOLO_Initialization_Commands.ipynb notebook
# subprocess.run(["jupyter", "nbconvert", "--to", "notebook", "--execute", "--inplace", "c:/Ellipsis/server/YOLO_Initialization_Commands.ipynb"])

from ultralytics import YOLO
from datetime import datetime
import psycopg2
import cv2

# Database credentials
db_host = "localhost"
db_port = 5432
db_name = "postgres"  # Replace with your database name
db_user = "postgres"  # Replace with your username
db_password = "root"  # Replace with your password

# Initialize YOLO model
model = YOLO("best.pt")  # Replace with your model path

def check_db_connection():
    """
    Checks if the connection to the database is successful.
    """
    try:
        conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_password)
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
conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_password)
cur = conn.cursor()
print("Connected to PostgreSQL.")

# # Create table if it doesn't exist
# cur.execute("""
# CREATE TABLE IF NOT EXISTS object_detections (
#     frameID SERIAL PRIMARY KEY,
#     Timestamp TIMESTAMP,
#     Person INTEGER,
#     Helmet INTEGER,
#     No_Helmet INTEGER,
#     Vest INTEGER,
#     No_Vest INTEGER,
#     Glove INTEGER,
#     No_Glove INTEGER,
#     Shoe INTEGER,
#     No_Shoe INTEGER
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
        "Vest": 0,
        "No Vest": 0, 
        "Glove": 0,
        "No Glove": 0,
        "Shoe": 0,
        "No Shoe": 0
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
    INSERT INTO phase_1_detections (Timestamp, Person, Helmet, No_Helmet, Vest, No_Vest, Glove, No_Glove, Shoe, No_Shoe)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (timestamp, counts["Person"], counts["Helmet"], counts["No Helmet"], counts["Vest"], counts["No Vest"],
          counts["Glove"], counts["No Glove"], counts["Shoe"], counts["No Shoe"]))
    conn.commit()
    print("Processed frame and updated database.")

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

# Directory containing the videos
video_directory = "./phase_1_videos"

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