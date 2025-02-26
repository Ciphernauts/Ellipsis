from ultralytics import YOLO
from datetime import datetime
import psycopg2
import cv2

# Database credentials
db_host = "localhost"
db_port = 5432
db_name = "ObjectDetection"  # Replace with your database name
db_user = "postgres"  # Replace with your username
db_password = "root"  # Replace with your password

# Initialize YOLO model
model = YOLO("server/src/assets/best (5).pt")  # Replace with your model path

# Connect to PostgreSQL
conn = psycopg2.connect(host=db_host, port=db_port, database=db_name, user=db_user, password=db_password)
cur = conn.cursor()

# Create table if it doesn't exist
cur.execute("""
CREATE TABLE IF NOT EXISTS object_detections (
    Timestamp TIMESTAMP,
    Person INTEGER,
    Helmet INTEGER,
    No_Helmet INTEGER,
    Vest INTEGER,
    No_Vest INTEGER,
    Glove INTEGER,
    No_Glove INTEGER,
    Shoe INTEGER,
    Shoe_No INTEGER
)
""")
conn.commit()

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
        "No_Helmet": 0,
        "Vest": 0,
        "No_Vest": 0,  # Use 'No_Vest' with an underscore
        "Glove": 0,
        "No_Glove": 0,
        "Shoe": 0,
        "Shoe_No": 0
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
    INSERT INTO object_detections (Timestamp, Person, Helmet, No_Helmet, Vest, No_Vest, Glove, No_Glove, Shoe, Shoe_No)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (timestamp, counts["Person"], counts["Helmet"], counts["No_Helmet"], counts["Vest"], counts["No_Vest"],
          counts["Glove"], counts["No_Glove"], counts["Shoe"], counts["Shoe_No"]))
    conn.commit()

# Example usage with manual frame extraction
video_path = "server/src/assets/011_15fps.mp4"  # Replace with your video path
cap = cv2.VideoCapture(video_path)

while(cap.isOpened()):
    ret, frame = cap.read()
    if ret == True:
        process_frame(frame)
    else:
        break

cap.release()

# Close the database connection
cur.close()
conn.close()