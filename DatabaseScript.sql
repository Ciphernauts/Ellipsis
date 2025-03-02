-- Create Phase 1 PPE Detection Table

CREATE TABLE IF NOT EXISTS phase_1_detections (
    Timestamp TIMESTAMP,
    Person INTEGER,
    Helmet INTEGER,
    No_Helmet INTEGER,
    Vest INTEGER,
    No_Vest INTEGER,
    Glove INTEGER,
    No_Glove INTEGER,
    Shoe INTEGER,
    No_Shoe INTEGER
);

SELECT * FROM phase_1_detections;

-- CREATE ALL TABLES

-- Create the 'construction_sites' table
CREATE TABLE construction_sites (
    site_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20),
    safetyScore DECIMAL(5, 2),
    snapshots TEXT
);

-- Define a custom ENUM type 'site_status'
CREATE TYPE site_status AS ENUM ('Active', 'Inactive');

-- Alter the 'status' column in 'construction_sites' to use the 'site_status' ENUM type
ALTER TABLE construction_sites ALTER COLUMN status TYPE site_status USING status::site_status;

-- Set the default value of the 'status' column to 'Inactive'
ALTER TABLE construction_sites ALTER COLUMN status SET DEFAULT 'Inactive'::site_status;

-- Create the 'cameras' table
CREATE TABLE cameras (
    camera_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site_id INT,
    type VARCHAR(50) NOT NULL,
    online BOOLEAN,
    connected BOOLEAN,
    last_synced_time TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES construction_sites(site_id) ON DELETE SET NULL
);

-- Define a custom ENUM type 'session_mode'
CREATE TYPE session_mode AS ENUM ('General', 'Height', 'Entry', 'Workshop');

-- Create the 'sessions' table
CREATE TABLE sessions (
    session_id VARCHAR(10) PRIMARY KEY,
    site_id INT,
    camera_id INT,
    mode session_mode NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    safety_score DECIMAL(5,2) NOT NULL,
    progress VARCHAR(10) NULL,
    FOREIGN KEY (site_id) REFERENCES construction_sites(site_id) ON DELETE CASCADE,
    FOREIGN KEY (camera_id) REFERENCES cameras(camera_id) ON DELETE SET NULL
);

-- Create the 'snapshots' table
CREATE TABLE snapshots (
    snapshot_id SERIAL PRIMARY KEY,
    session_id VARCHAR(10),
    image_url VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Define a custom ENUM type 'incident_severity' 
CREATE TYPE incident_severity AS ENUM ('Moderate', 'Critical');

-- Create the 'incidents' table 
CREATE TABLE incidents (
    incident_id SERIAL PRIMARY KEY,
    session_id VARCHAR(10),
    incident_time TIMESTAMP NOT NULL,
    severity incident_severity NOT NULL,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Create a custom ENUM type for incident status
CREATE TYPE incident_status AS ENUM ('Open', 'Resolved', 'False Alarm');

-- Alter the 'status' column in 'incidents' to use the 'incident_status' ENUM type
ALTER TABLE incidents ALTER COLUMN status TYPE incident_status USING status::TEXT::incident_status;

-- Create the 'safety_score_trends' table
CREATE TABLE safety_score_trends (
    trend_id SERIAL PRIMARY KEY,
    session_id VARCHAR(10),
    "timestamp" TIMESTAMP NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Create the 'safety_score_distribution' table
CREATE TABLE safety_score_distribution (
    distribution_id SERIAL PRIMARY KEY,
    session_id VARCHAR(10),
    helmet_score DECIMAL(5,2) NOT NULL,
    footwear_score DECIMAL(5,2) NOT NULL,
    vest_score DECIMAL(5,2) NOT NULL,
    gloves_score DECIMAL(5, 2),
    scaffolding_score DECIMAL(5, 2),
    guardrails_score DECIMAL(5, 2),
    harness_score DECIMAL(5, 2),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Indexing for Performance Optimization
CREATE INDEX idx_session_id ON sessions(session_id);
CREATE INDEX idx_site_id ON construction_sites(site_id);
CREATE INDEX idx_camera_id ON cameras(camera_id);
CREATE INDEX idx_session_time ON sessions(start_time);
CREATE INDEX idx_incident_time ON incidents (incident_time);
CREATE INDEX idx_incident_severity ON incidents (severity);
CREATE INDEX idx_incident_status ON incidents (status);
CREATE INDEX idx_incident_category ON incidents (category);
CREATE INDEX idx_sessions_site_id ON sessions (site_id);
CREATE INDEX idx_cameras_site_id ON cameras (site_id);

----------------------------------------------------------------------------------------------------------------

-- Populate all tables with data

INSERT INTO construction_sites (name, location, status, safetyScore, snapshots) VALUES
    ('Riverside Apartments Project', 'Abu Dhabi', 'Active', 88.5, '{
        "https://picsum.photos/id/10/200/150",
        "https://picsum.photos/id/11/200/150",
        "https://picsum.photos/id/12/200/150"
    }'::TEXT),
    ('Hilltop Heights Construction', 'Dubai', 'Completed', 84.2, '{
        "https://picsum.photos/id/20/200/150",
        "https://picsum.photos/id/21/200/150"
    }'::TEXT),
    ('Downtown Mall Construction', 'Sharjah', 'Active', 90.1, '{
        "https://picsum.photos/id/30/200/150",
        "https://picsum.photos/id/31/200/150",
        "https://picsum.photos/id/32/200/150",
        "https://picsum.photos/id/33/200/150"
    }'::TEXT),
    ('Northside Office Tower', 'Ajman', 'Inactive', 82.0, '{}'::TEXT),
    ('Westside Residential Complex', 'Umm Al Quwain', 'Active', 87.4, '{
        "https://picsum.photos/id/40/200/150"
    }'::TEXT),
    ('Eastside Industrial Park', 'Ras Al Khaimah', 'Active', 89.8, '{
        "https://picsum.photos/id/50/200/150",
        "https://picsum.photos/id/51/200/150",
        "https://picsum.photos/id/52/200/150"
    }'::TEXT),
    ('Southside Stadium Renovation', 'Fujairah', 'Completed', 91.3, '{
        "https://picsum.photos/id/60/200/150",
        "https://picsum.photos/id/61/200/150",
        "https://picsum.photos/id/62/200/150"
    }'::TEXT),
    ('Central Business Park', 'Abu Dhabi', 'Active', 86.0, '{
        "https://picsum.photos/id/70/200/150",
        "https://picsum.photos/id/71/200/150"
    }'::TEXT),
    ('Coastal Marina Development', 'Dubai', 'Active', 84.4, '{
        "https://picsum.photos/id/80/200/150",
        "https://picsum.photos/id/81/200/150",
        "https://picsum.photos/id/82/200/150"
    }'::TEXT);

--remove location

INSERT INTO cameras (name, model, location, site_id, type, online, connected, last_synced_time) VALUES
    ('DJI Matrice 300 RTK', 'M300', 'Building A', 1, 'drone', TRUE, TRUE, '2025-03-01 16:15:00'),
    ('FLIR Quasar 4K IR PTZ', 'FQR4K', 'Building B', 1, 'camera', TRUE, FALSE, '2025-03-01 12:10:00'),
    ('Axis P1448-LE', 'AXP1448', 'Entrance', 1, 'camera', FALSE, TRUE, '2025-03-01 08:05:00'),
    ('Anafi USA', 'ANU', 'Building C', 2, 'drone', TRUE, TRUE, '2025-03-01 10:00:00'),
    ('Autel Robotics EVO II Pro', 'AE2P', 'Building A', 3, 'drone', FALSE, FALSE, '2025-02-28 18:00:00'),
    ('Skydio 2+', 'SK2+', 'Building B', 4, 'camera', TRUE, TRUE, '2025-03-01 14:30:00'),
    ('Bosch FLEXIDOME IP starlight 8000i', 'BFI8000', 'Building C', 5, 'camera', TRUE, FALSE, '2025-03-01 11:45:00'),
    ('Hikvision DS-2CD2387G2-LU', 'HD2387', 'Entrance', 6, 'camera', FALSE, TRUE, '2025-03-01 09:20:00'),
    ('DJI Inspire 3', 'DI3', 'Building A', 7, 'drone', TRUE, TRUE, '2025-03-01 15:50:00'),
    ('Sony SNC-VM772R', 'SSVM772', 'Building B', 7, 'camera', TRUE, TRUE, '2025-03-01 13:15:00');

--remove model, location, site_id



INSERT INTO sessions (session_id, site_id, camera_id, mode, start_time, end_time, safety_score, progress) VALUES
    ('S0028', 1, 1, 'General', '2025-02-01 08:00:00', '2025-02-01 16:00:00', 82.5, '+2.3%'),
    ('S0029', 2, 2, 'Height', '2025-02-01 09:00:00', '2025-02-01 17:00:00', 78.2, NULL),
    ('S0030', 3, 3, 'Entry', '2025-02-01 10:00:00', '2025-02-01 18:00:00', 85.1, NULL),
    ('S0031', 4, 4, 'General', '2025-02-01 11:00:00', '2025-02-01 19:00:00', 68.0, NULL),
    ('S0032', 5, 5, 'Entry', '2025-02-01 12:00:00', '2025-02-01 20:00:00', 80.4, NULL),
    ('S0033', 6, 6, 'Entry', '2025-02-02 08:00:00', '2025-02-02 16:00:00', 87.8, NULL),
    ('S0034', 7, 7, 'Workshop', '2025-02-02 09:00:00', '2025-02-02 17:00:00', 89.3, NULL),
    ('S0035', 8, 8, 'General', '2025-02-02 10:00:00', '2025-02-02 18:00:00', 76.0, NULL),
    ('S0036', 9, 9, 'General', '2025-02-02 11:00:00', '2025-02-02 19:00:00', 84.4, NULL),
    ('S0037', 1, 10, 'Height', '2025-02-02 12:00:00', '2025-02-02 20:00:00', 83.4, NULL),
    ('S0038', 2, 1, 'General', '2025-02-03 08:00:00', '2025-02-03 16:00:00', 79.7, NULL),
    ('S0039', 3, 2, 'General', '2025-02-03 09:00:00', '2025-02-03 17:00:00', 83.3, NULL),
    ('S0040', 4, 3, 'Entry', '2025-02-03 10:00:00', '2025-02-03 18:00:00', 70.6, NULL),
    ('S0041', 5, 4, 'General', '2025-02-03 11:00:00', '2025-02-03 19:00:00', 85.2, NULL),
    ('S0042', 6, 5, 'General', '2025-02-03 12:00:00', '2025-02-03 20:00:00', 81.2, NULL),
    ('S0043', 7, 6, 'General', '2025-02-04 08:00:00', '2025-02-04 16:00:00', 86.2, NULL),
    ('S0044', 8, 7, 'General', '2025-02-04 09:00:00', '2025-02-04 17:00:00', 79.1, NULL),
    ('S0045', 9, 8, 'General', '2025-02-04 10:00:00', '2025-02-04 18:00:00', 84.8, NULL),
    ('S0046', 1, 9, 'Height', '2025-02-04 11:00:00', '2025-02-04 19:00:00', 84.4, NULL),
    ('S0047', 2, 10, 'General', '2025-02-04 12:00:00', '2025-02-04 20:00:00', 80.7, NULL),
    ('S0048', 3, 1, 'General', '2025-02-05 08:00:00', '2025-02-05 16:00:00', 81.7, NULL),
    ('S0049', 4, 2, 'Entry', '2025-02-05 09:00:00', '2025-02-05 17:00:00', 68.6, NULL),
    ('S0050', 5, 3, 'General', '2025-02-05 10:00:00', '2025-02-05 18:00:00', 83.2, NULL),
    ('S0051', 6, 4, 'General', '2025-02-05 11:00:00', '2025-02-05 19:00:00', 79.2, NULL),
    ('S0052', 7, 5, 'Workshop', '2025-02-05 12:00:00', '2025-02-05 20:00:00', 88.2, NULL),
    ('S0053', 8, 6, 'General', '2025-02-06 08:00:00', '2025-02-06 16:00:00', 76.2, NULL),
    ('S0054', 9, 7, 'General', '2025-02-06 09:00:00', '2025-02-06 17:00:00', 84.1, NULL),
    ('S0055', 1, 8, 'Height', '2025-02-06 10:00:00', '2025-02-06 18:00:00', 83.4, NULL),
    ('S0056', 2, 9, 'General', '2025-02-06 11:00:00', '2025-02-06 19:00:00', 78.7, NULL),
    ('S0057', 3, 10, 'General', '2025-02-06 12:00:00', '2025-02-06 20:00:00', 80.3, NULL),
    ('S0058', 4, 1, 'Entry', '2025-02-07 08:00:00', '2025-02-07 16:00:00', 75.6, NULL),
    ('S0059', 5, 2, 'General', '2025-02-07 09:00:00', '2025-02-07 17:00:00', 81.2, NULL),
    ('S0060', 6, 3, 'General', '2025-02-07 10:00:00', '2025-02-07 18:00:00', 86.2, NULL),
    ('S0061', 7, 4, 'Workshop', '2025-02-07 11:00:00', '2025-02-07 19:00:00', 88.3, NULL),
    ('S0062', 8, 5, 'General', '2025-02-07 12:00:00', '2025-02-07 20:00:00', 80.2, NULL),
    ('S0063', 9, 6, 'General', '2025-02-08 08:00:00', '2025-02-08 16:00:00', 83.2, NULL),
    ('S0064', 1, 7, 'Height', '2025-02-08 09:00:00', '2025-02-08 17:00:00', 80.4, NULL),
    ('S0065', 2, 8, 'General', '2025-02-08 10:00:00', '2025-02-08 18:00:00', 78.7, NULL),
    ('S0066', 3, 9, 'General', '2025-02-08 11:00:00', '2025-02-08 19:00:00', 84.3, NULL),
    ('S0067', 4, 10, 'Entry', '2025-02-08 12:00:00', '2025-02-08 20:00:00', 74.6, NULL),
    ('S0068', 5, 1, 'General', '2025-02-09 08:00:00', '2025-02-09 16:00:00', 80.2, NULL),
    ('S0069', 6, 2, 'General', '2025-02-09 09:00:00', '2025-02-09 17:00:00', 85.2, NULL),
    ('S0070', 7, 3, 'Workshop', '2025-02-09 10:00:00', '2025-02-09 18:00:00', 87.2, NULL),
    ('S0071', 8, 4, 'General', '2025-02-09 11:00:00', '2025-02-09 19:00:00', 78.2, NULL),
    ('S0072', 9, 5, 'General', '2025-02-09 12:00:00', '2025-02-09 20:00:00', 81.2, NULL),
    ('S0073', 1, 6, 'Height', '2025-02-10 08:00:00', '2025-02-10 16:00:00', 84.4, NULL),
    ('S0074', 2, 7, 'General', '2025-02-10 09:00:00', '2025-02-10 17:00:00', 79.7, NULL),
    ('S0075', 3, 8, 'General', '2025-02-10 10:00:00', '2025-02-10 18:00:00', 80.3, NULL),
    ('S0076', 4, 9, 'Entry', '2025-02-10 11:00:00', '2025-02-10 19:00:00', 76.6, NULL),
    ('S0077', 5, 10, 'General', '2025-02-10 12:00:00', '2025-02-10 20:00:00', 82.2, NULL);



-- SNAPSHOTS

-- Session S0028
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0028', 'https://picsum.photos/id/100/200/150', '2025-02-01 09:00:00'),
    ('S0028', 'https://picsum.photos/id/101/200/150', '2025-02-01 11:00:00'),
    ('S0028', 'https://picsum.photos/id/102/200/150', '2025-02-01 13:00:00'),
    ('S0028', 'https://picsum.photos/id/103/200/150', '2025-02-01 15:00:00');

-- Session S0029
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0029', 'https://picsum.photos/id/104/200/150', '2025-02-01 10:00:00'),
    ('S0029', 'https://picsum.photos/id/105/200/150', '2025-02-01 12:00:00'),
    ('S0029', 'https://picsum.photos/id/106/200/150', '2025-02-01 14:00:00'),
    ('S0029', 'https://picsum.photos/id/107/200/150', '2025-02-01 16:00:00');

-- Session S0030
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0030', 'https://picsum.photos/id/108/200/150', '2025-02-01 11:00:00'),
    ('S0030', 'https://picsum.photos/id/109/200/150', '2025-02-01 13:00:00'),
    ('S0030', 'https://picsum.photos/id/110/200/150', '2025-02-01 15:00:00'),
    ('S0030', 'https://picsum.photos/id/111/200/150', '2025-02-01 17:00:00');

-- Session S0031
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0031', 'https://picsum.photos/id/112/200/150', '2025-02-01 12:00:00'),
    ('S0031', 'https://picsum.photos/id/113/200/150', '2025-02-01 14:00:00'),
    ('S0031', 'https://picsum.photos/id/114/200/150', '2025-02-01 16:00:00'),
    ('S0031', 'https://picsum.photos/id/115/200/150', '2025-02-01 18:00:00');

-- Session S0032
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0032', 'https://picsum.photos/id/116/200/150', '2025-02-01 13:00:00'),
    ('S0032', 'https://picsum.photos/id/117/200/150', '2025-02-01 15:00:00'),
    ('S0032', 'https://picsum.photos/id/118/200/150', '2025-02-01 17:00:00'),
    ('S0032', 'https://picsum.photos/id/119/200/150', '2025-02-01 19:00:00');

-- Session S0033
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0033', 'https://picsum.photos/id/120/200/150', '2025-02-02 09:00:00'),
    ('S0033', 'https://picsum.photos/id/121/200/150', '2025-02-02 11:00:00'),
    ('S0033', 'https://picsum.photos/id/122/200/150', '2025-02-02 13:00:00'),
    ('S0033', 'https://picsum.photos/id/123/200/150', '2025-02-02 15:00:00');

-- Session S0034
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0034', 'https://picsum.photos/id/124/200/150', '2025-02-02 10:00:00'),
    ('S0034', 'https://picsum.photos/id/125/200/150', '2025-02-02 12:00:00'),
    ('S0034', 'https://picsum.photos/id/126/200/150', '2025-02-02 14:00:00'),
    ('S0034', 'https://picsum.photos/id/127/200/150', '2025-02-02 16:00:00');

-- Session S0035
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0035', 'https://picsum.photos/id/128/200/150', '2025-02-02 11:00:00'),
    ('S0035', 'https://picsum.photos/id/129/200/150', '2025-02-02 13:00:00'),
    ('S0035', 'https://picsum.photos/id/130/200/150', '2025-02-02 15:00:00'),
    ('S0035', 'https://picsum.photos/id/131/200/150', '2025-02-02 17:00:00');

-- Session S0036
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0036', 'https://picsum.photos/id/132/200/150', '2025-02-02 12:00:00'),
    ('S0036', 'https://picsum.photos/id/133/200/150', '2025-02-02 14:00:00'),
    ('S0036', 'https://picsum.photos/id/134/200/150', '2025-02-02 16:00:00'),
    ('S0036', 'https://picsum.photos/id/135/200/150', '2025-02-02 18:00:00');

-- Session S0037
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0037', 'https://picsum.photos/id/136/200/150', '2025-02-02 13:00:00'),
    ('S0037', 'https://picsum.photos/id/137/200/150', '2025-02-02 15:00:00'),
    ('S0037', 'https://picsum.photos/id/138/200/150', '2025-02-02 17:00:00'),
    ('S0037', 'https://picsum.photos/id/139/200/150', '2025-02-02 19:00:00');

-- Session S0038
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0038', 'https://picsum.photos/id/140/200/150', '2025-02-03 09:00:00'),
    ('S0038', 'https://picsum.photos/id/141/200/150', '2025-02-03 11:00:00'),
    ('S0038', 'https://picsum.photos/id/142/200/150', '2025-02-03 13:00:00'),
    ('S0038', 'https://picsum.photos/id/143/200/150', '2025-02-03 15:00:00');

-- Session S0039
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0039', 'https://picsum.photos/id/144/200/150', '2025-02-03 10:00:00'),
    ('S0039', 'https://picsum.photos/id/145/200/150', '2025-02-03 12:00:00'),
    ('S0039', 'https://picsum.photos/id/146/200/150', '2025-02-03 14:00:00'),
    ('S0039', 'https://picsum.photos/id/147/200/150', '2025-02-03 16:00:00');

-- Session S0040
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0040', 'https://picsum.photos/id/148/200/150', '2025-02-03 11:00:00'),
    ('S0040', 'https://picsum.photos/id/149/200/150', '2025-02-03 13:00:00'),
    ('S0040', 'https://picsum.photos/id/150/200/150', '2025-02-03 15:00:00'),
    ('S0040', 'https://picsum.photos/id/151/200/150', '2025-02-03 17:00:00');

-- Session S0041
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0041', 'https://picsum.photos/id/152/200/150', '2025-02-03 12:00:00'),
    ('S0041', 'https://picsum.photos/id/153/200/150', '2025-02-03 14:00:00'),
    ('S0041', 'https://picsum.photos/id/154/200/150', '2025-02-03 16:00:00'),
    ('S0041', 'https://picsum.photos/id/155/200/150', '2025-02-03 18:00:00');

-- Session S0042
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0042', 'https://picsum.photos/id/156/200/150', '2025-02-03 13:00:00'),
    ('S0042', 'https://picsum.photos/id/157/200/150', '2025-02-03 15:00:00'),
    ('S0042', 'https://picsum.photos/id/158/200/150', '2025-02-03 17:00:00'),
    ('S0042', 'https://picsum.photos/id/159/200/150', '2025-02-03 19:00:00');

-- Session S0043
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0043', 'https://picsum.photos/id/160/200/150', '2025-02-04 09:00:00'),
    ('S0043', 'https://picsum.photos/id/161/200/150', '2025-02-04 11:00:00'),
    ('S0043', 'https://picsum.photos/id/162/200/150', '2025-02-04 13:00:00'),
    ('S0043', 'https://picsum.photos/id/163/200/150', '2025-02-04 15:00:00');

-- Session S0044
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0044', 'https://picsum.photos/id/164/200/150', '2025-02-04 10:00:00'),
    ('S0044', 'https://picsum.photos/id/165/200/150', '2025-02-04 12:00:00'),
    ('S0044', 'https://picsum.photos/id/166/200/150', '2025-02-04 14:00:00'),
    ('S0044', 'https://picsum.photos/id/167/200/150', '2025-02-04 16:00:00');

-- Session S0045
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0045', 'https://picsum.photos/id/168/200/150', '2025-02-04 11:00:00'),
    ('S0045', 'https://picsum.photos/id/169/200/150', '2025-02-04 13:00:00'),
    ('S0045', 'https://picsum.photos/id/170/200/150', '2025-02-04 15:00:00'),
    ('S0045', 'https://picsum.photos/id/171/200/150', '2025-02-04 17:00:00');

-- Session S0046
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0046', 'https://picsum.photos/id/172/200/150', '2025-02-04 12:00:00'),
    ('S0046', 'https://picsum.photos/id/173/200/150', '2025-02-04 14:00:00'),
    ('S0046', 'https://picsum.photos/id/174/200/150', '2025-02-04 16:00:00'),
    ('S0046', 'https://picsum.photos/id/175/200/150', '2025-02-04 18:00:00');

-- Session S0047
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0047', 'https://picsum.photos/id/176/200/150', '2025-02-04 13:00:00'),
    ('S0047', 'https://picsum.photos/id/177/200/150', '2025-02-04 15:00:00'),
    ('S0047', 'https://picsum.photos/id/178/200/150', '2025-02-04 17:00:00'),
    ('S0047', 'https://picsum.photos/id/179/200/150', '2025-02-04 19:00:00');

-- Session S0048
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0048', 'https://picsum.photos/id/180/200/150', '2025-02-05 09:00:00'),
    ('S0048', 'https://picsum.photos/id/181/200/150', '2025-02-05 11:00:00'),
    ('S0048', 'https://picsum.photos/id/182/200/150', '2025-02-05 13:00:00'),
    ('S0048', 'https://picsum.photos/id/183/200/150', '2025-02-05 15:00:00');

-- Session S0049
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0049', 'https://picsum.photos/id/184/200/150', '2025-02-05 10:00:00'),
    ('S0049', 'https://picsum.photos/id/185/200/150', '2025-02-05 12:00:00'),
    ('S0049', 'https://picsum.photos/id/186/200/150', '2025-02-05 14:00:00'),
    ('S0049', 'https://picsum.photos/id/187/200/150', '2025-02-05 16:00:00');

-- Session S0050
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0050', 'https://picsum.photos/id/188/200/150', '2025-02-05 11:00:00'),
    ('S0050', 'https://picsum.photos/id/189/200/150', '2025-02-05 13:00:00'),
    ('S0050', 'https://picsum.photos/id/190/200/150', '2025-02-05 15:00:00'),
    ('S0050', 'https://picsum.photos/id/191/200/150', '2025-02-05 17:00:00');

-- Session S0051
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0051', 'https://picsum.photos/id/192/200/150', '2025-02-05 12:00:00'),
    ('S0051', 'https://picsum.photos/id/193/200/150', '2025-02-05 14:00:00'),
    ('S0051', 'https://picsum.photos/id/194/200/150', '2025-02-05 16:00:00'),
    ('S0051', 'https://picsum.photos/id/195/200/150', '2025-02-05 18:00:00');

-- Session S0052
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0052', 'https://picsum.photos/id/196/200/150', '2025-02-05 13:00:00'),
    ('S0052', 'https://picsum.photos/id/197/200/150', '2025-02-05 15:00:00'),
    ('S0052', 'https://picsum.photos/id/198/200/150', '2025-02-05 17:00:00'),
    ('S0052', 'https://picsum.photos/id/199/200/150', '2025-02-05 19:00:00');

-- Session S0053
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0053', 'https://picsum.photos/id/200/200/150', '2025-02-06 09:00:00'),
    ('S0053', 'https://picsum.photos/id/201/200/150', '2025-02-06 11:00:00'),
    ('S0053', 'https://picsum.photos/id/202/200/150', '2025-02-06 13:00:00'),
    ('S0053', 'https://picsum.photos/id/203/200/150', '2025-02-06 15:00:00');

-- Session S0054
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0054', 'https://picsum.photos/id/204/200/150', '2025-02-06 10:00:00'),
    ('S0054', 'https://picsum.photos/id/205/200/150', '2025-02-06 12:00:00'),
    ('S0054', 'https://picsum.photos/id/206/200/150', '2025-02-06 14:00:00'),
    ('S0054', 'https://picsum.photos/id/207/200/150', '2025-02-06 16:00:00');

-- Session S0055
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0055', 'https://picsum.photos/id/208/200/150', '2025-02-06 11:00:00'),
    ('S0055', 'https://picsum.photos/id/209/200/150', '2025-02-06 13:00:00'),
    ('S0055', 'https://picsum.photos/id/210/200/150', '2025-02-06 15:00:00'),
    ('S0055', 'https://picsum.photos/id/211/200/150', '2025-02-06 17:00:00');

-- Session S0056
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0056', 'https://picsum.photos/id/212/200/150', '2025-02-06 12:00:00'),
    ('S0056', 'https://picsum.photos/id/213/200/150', '2025-02-06 14:00:00'),
    ('S0056', 'https://picsum.photos/id/214/200/150', '2025-02-06 16:00:00'),
    ('S0056', 'https://picsum.photos/id/215/200/150', '2025-02-06 18:00:00');

-- Session S0057
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0057', 'https://picsum.photos/id/216/200/150', '2025-02-06 13:00:00'),
    ('S0057', 'https://picsum.photos/id/217/200/150', '2025-02-06 15:00:00'),
    ('S0057', 'https://picsum.photos/id/218/200/150', '2025-02-06 17:00:00'),
    ('S0057', 'https://picsum.photos/id/219/200/150', '2025-02-06 19:00:00');

-- Session S0058
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0058', 'https://picsum.photos/id/220/200/150', '2025-02-07 09:00:00'),
    ('S0058', 'https://picsum.photos/id/221/200/150', '2025-02-07 11:00:00'),
    ('S0058', 'https://picsum.photos/id/222/200/150', '2025-02-07 13:00:00'),
    ('S0058', 'https://picsum.photos/id/223/200/150', '2025-02-07 15:00:00');

-- Session S0059
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0059', 'https://picsum.photos/id/224/200/150', '2025-02-07 10:00:00'),
    ('S0059', 'https://picsum.photos/id/225/200/150', '2025-02-07 12:00:00'),
    ('S0059', 'https://picsum.photos/id/226/200/150', '2025-02-07 14:00:00'),
    ('S0059', 'https://picsum.photos/id/227/200/150', '2025-02-07 16:00:00');

-- Session S0060
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0060', 'https://picsum.photos/id/228/200/150', '2025-02-07 11:00:00'),
    ('S0060', 'https://picsum.photos/id/229/200/150', '2025-02-07 13:00:00'),
    ('S0060', 'https://picsum.photos/id/230/200/150', '2025-02-07 15:00:00'),
    ('S0060', 'https://picsum.photos/id/231/200/150', '2025-02-07 17:00:00');

-- Session S0061
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0061', 'https://picsum.photos/id/232/200/150', '2025-02-07 12:00:00'),
    ('S0061', 'https://picsum.photos/id/233/200/150', '2025-02-07 14:00:00'),
    ('S0061', 'https://picsum.photos/id/234/200/150', '2025-02-07 16:00:00'),
    ('S0061', 'https://picsum.photos/id/235/200/150', '2025-02-07 18:00:00');

-- Session S0062
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0062', 'https://picsum.photos/id/236/200/150', '2025-02-07 13:00:00'),
    ('S0062', 'https://picsum.photos/id/237/200/150', '2025-02-07 15:00:00'),
    ('S0062', 'https://picsum.photos/id/238/200/150', '2025-02-07 17:00:00'),
    ('S0062', 'https://picsum.photos/id/239/200/150', '2025-02-07 19:00:00');

-- Session S0063
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0063', 'https://picsum.photos/id/240/200/150', '2025-02-08 09:00:00'),
    ('S0063', 'https://picsum.photos/id/241/200/150', '2025-02-08 11:00:00'),
    ('S0063', 'https://picsum.photos/id/242/200/150', '2025-02-08 13:00:00'),
    ('S0063', 'https://picsum.photos/id/243/200/150', '2025-02-08 15:00:00');

-- Session S0064
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0064', 'https://picsum.photos/id/244/200/150', '2025-02-08 10:00:00'),
    ('S0064', 'https://picsum.photos/id/245/200/150', '2025-02-08 12:00:00'),
    ('S0064', 'https://picsum.photos/id/246/200/150', '2025-02-08 14:00:00'),
    ('S0064', 'https://picsum.photos/id/247/200/150', '2025-02-08 16:00:00');

-- Session S0065
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0065', 'https://picsum.photos/id/248/200/150', '2025-02-08 11:00:00'),
    ('S0065', 'https://picsum.photos/id/249/200/150', '2025-02-08 13:00:00'),
    ('S0065', 'https://picsum.photos/id/250/200/150', '2025-02-08 15:00:00'),
    ('S0065', 'https://picsum.photos/id/251/200/150', '2025-02-08 17:00:00');

-- Session S0066
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0066', 'https://picsum.photos/id/252/200/150', '2025-02-08 12:00:00'),
    ('S0066', 'https://picsum.photos/id/253/200/150', '2025-02-08 14:00:00'),
    ('S0066', 'https://picsum.photos/id/254/200/150', '2025-02-08 16:00:00'),
    ('S0066', 'https://picsum.photos/id/255/200/150', '2025-02-08 18:00:00');

-- Session S0067
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0067', 'https://picsum.photos/id/256/200/150', '2025-02-08 13:00:00'),
    ('S0067', 'https://picsum.photos/id/257/200/150', '2025-02-08 15:00:00'),
    ('S0067', 'https://picsum.photos/id/258/200/150', '2025-02-08 17:00:00'),
    ('S0067', 'https://picsum.photos/id/259/200/150', '2025-02-08 19:00:00');

-- Session S0068
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0068', 'https://picsum.photos/id/260/200/150', '2025-02-09 09:00:00'),
    ('S0068', 'https://picsum.photos/id/261/200/150', '2025-02-09 11:00:00'),
    ('S0068', 'https://picsum.photos/id/262/200/150', '2025-02-09 13:00:00'),
    ('S0068', 'https://picsum.photos/id/263/200/150', '2025-02-09 15:00:00');

-- Session S0069
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0069', 'https://picsum.photos/id/264/200/150', '2025-02-09 10:00:00'),
    ('S0069', 'https://picsum.photos/id/265/200/150', '2025-02-09 12:00:00'),
    ('S0069', 'https://picsum.photos/id/266/200/150', '2025-02-09 14:00:00'),
    ('S0069', 'https://picsum.photos/id/267/200/150', '2025-02-09 16:00:00');

-- Session S0070
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0070', 'https://picsum.photos/id/268/200/150', '2025-02-09 11:00:00'),
    ('S0070', 'https://picsum.photos/id/269/200/150', '2025-02-09 13:00:00'),
    ('S0070', 'https://picsum.photos/id/270/200/150', '2025-02-09 15:00:00'),
    ('S0070', 'https://picsum.photos/id/271/200/150', '2025-02-09 17:00:00');

-- Session S0071
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0071', 'https://picsum.photos/id/272/200/150', '2025-02-09 12:00:00'),
    ('S0071', 'https://picsum.photos/id/273/200/150', '2025-02-09 14:00:00'),
    ('S0071', 'https://picsum.photos/id/274/200/150', '2025-02-09 16:00:00'),
    ('S0071', 'https://picsum.photos/id/275/200/150', '2025-02-09 18:00:00');

-- Session S0072
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0072', 'https://picsum.photos/id/276/200/150', '2025-02-09 13:00:00'),
    ('S0072', 'https://picsum.photos/id/277/200/150', '2025-02-09 15:00:00'),
    ('S0072', 'https://picsum.photos/id/278/200/150', '2025-02-09 17:00:00'),
    ('S0072', 'https://picsum.photos/id/279/200/150', '2025-02-09 19:00:00');

-- Session S0073
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0073', 'https://picsum.photos/id/280/200/150', '2025-02-10 09:00:00'),
    ('S0073', 'https://picsum.photos/id/281/200/150', '2025-02-10 11:00:00'),
    ('S0073', 'https://picsum.photos/id/282/200/150', '2025-02-10 13:00:00'),
    ('S0073', 'https://picsum.photos/id/283/200/150', '2025-02-10 15:00:00');

-- Session S0074
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0074', 'https://picsum.photos/id/284/200/150', '2025-02-10 10:00:00'),
    ('S0074', 'https://picsum.photos/id/285/200/150', '2025-02-10 12:00:00'),
    ('S0074', 'https://picsum.photos/id/286/200/150', '2025-02-10 14:00:00'),
    ('S0074', 'https://picsum.photos/id/287/200/150', '2025-02-10 16:00:00');

-- Session S0075
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0075', 'https://picsum.photos/id/288/200/150', '2025-02-10 11:00:00'),
    ('S0075', 'https://picsum.photos/id/289/200/150', '2025-02-10 13:00:00'),
    ('S0075', 'https://picsum.photos/id/290/200/150', '2025-02-10 15:00:00'),
    ('S0075', 'https://picsum.photos/id/291/200/150', '2025-02-10 17:00:00');

-- Session S0076
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0076', 'https://picsum.photos/id/292/200/150', '2025-02-10 12:00:00'),
    ('S0076', 'https://picsum.photos/id/293/200/150', '2025-02-10 14:00:00'),
    ('S0076', 'https://picsum.photos/id/294/200/150', '2025-02-10 16:00:00'),
    ('S0076', 'https://picsum.photos/id/295/200/150', '2025-02-10 18:00:00');

-- Session S0077
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0077', 'https://picsum.photos/id/296/200/150', '2025-02-10 13:00:00'),
    ('S0077', 'https://picsum.photos/id/297/200/150', '2025-02-10 15:00:00'),
    ('S0077', 'https://picsum.photos/id/298/200/150', '2025-02-10 17:00:00'),
    ('S0077', 'https://picsum.photos/id/299/200/150', '2025-02-10 19:00:00');



-- INCIDENTS --DESC  IS NAME SHOULD BE ENUM


-- Incidents for session S0028 (safety_score = 82.5) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0028', 'Worker not wearing helmet', '2025-02-01 09:30:00', 'Moderate', 'Open', 'helmet'),
    ('S0028', 'Worker near edge without harness', '2025-02-01 14:15:00', 'Moderate', 'Resolved', 'harness');

-- Incidents for session S0029 (safety_score = 78.2) - Moderate and Critical severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0029', 'Falling debris', '2025-02-01 10:45:00', 'Moderate', 'Resolved', 'general'),
    ('S0029', 'Worker climbing without safety harness', '2025-02-01 15:30:00', 'Critical', 'Open', 'harness');

-- Incidents for session S0030 (safety_score = 85.1) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0030', 'Unsecured tools on scaffolding', '2025-02-01 12:15:00', 'Low', 'Resolved', 'scaffolding');

-- Incidents for session S0031 (safety_score = 68.0) - Multiple incidents with varying severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0031', 'Worker without safety glasses', '2025-02-01 11:30:00', 'Low', 'Open', 'gloves'),
    ('S0031', 'Unsafe ladder placement', '2025-02-01 13:45:00', 'Moderate', 'Open', 'general'),
    ('S0031', 'Electrical hazard', '2025-02-01 16:20:00', 'High', 'Resolved', 'general'),
    ('S0031', 'Worker near moving machinery without PPE', '2025-02-01 18:10:00', 'Critical', 'Open', 'vest');

-- Incidents for session S0032 (safety_score = 80.4) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0032', 'Improper footwear', '2025-02-01 14:00:00', 'Moderate', 'Resolved', 'footwear');

-- Incidents for session S0033 (safety_score = 87.8) - No incidents

-- Incidents for session S0034 (safety_score = 89.3) - No incidents

-- Incidents for session S0035 (safety_score = 76.0) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0035', 'Worker on scaffolding without harness', '2025-02-02 11:30:00', 'Moderate', 'Open', 'harness'),
    ('S0035', 'Unprotected excavation', '2025-02-02 16:45:00', 'High', 'Resolved', 'general');

-- Incidents for session S0036 (safety_score = 84.4) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0036', 'Improper stacking of materials', '2025-02-02 14:15:00', 'Low', 'Resolved', 'general');

-- Incidents for session S0037 (safety_score = 83.4) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0037', 'Worker near edge without fall protection', '2025-02-02 17:00:00', 'Moderate', 'Open', 'guardrails');

-- Incidents for session S0038 (safety_score = 79.7) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0038', 'Worker not wearing gloves while handling chemicals', '2025-02-03 10:15:00', 'Moderate', 'Resolved', 'gloves');

-- Incidents for session S0039 (safety_score = 83.3) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0039', 'Obstructed fire exit', '2025-02-03 14:30:00', 'Low', 'Open', 'general');

-- Incidents for session S0040 (safety_score = 70.6) - Multiple incidents with varying severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0040', 'Worker without hard hat near falling objects', '2025-02-03 11:45:00', 'Moderate', 'Open', 'helmet'),
    ('S0040', 'Unsafe use of power tools', '2025-02-03 15:10:00', 'High', 'Resolved', 'general'),
    ('S0040', 'Worker falling from height', '2025-02-03 17:50:00', 'Critical', 'Open', 'harness');

-- Incidents for session S0041 (safety_score = 85.2) - No incidents

-- Incidents for session S0042 (safety_score = 81.2) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0042', 'Worker near edge without guardrails', '2025-02-03 16:00:00', 'Moderate', 'Resolved', 'guardrails');

-- Incidents for session S0043 (safety_score = 86.2) - No incidents

-- Incidents for session S0044 (safety_score = 79.1) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0044', 'Improper lifting technique', '2025-02-04 11:30:00', 'Moderate', 'Open', 'general');

-- Incidents for session S0045 (safety_score = 84.8) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0045', 'Cluttered walkway', '2025-02-04 15:45:00', 'Low', 'Resolved', 'general');

-- Incidents for session S0046 (safety_score = 84.4) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0046', 'Worker on elevated platform without harness', '2025-02-04 13:15:00', 'Moderate', 'Open', 'harness');

-- Incidents for session S0047 (safety_score = 80.7) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0047', 'Worker not wearing gloves while using cutting tools', '2025-02-04 17:00:00', 'Moderate', 'Resolved', 'gloves');

-- Incidents for session S0048 (safety_score = 81.7) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0048', 'Loose railing on stairs', '2025-02-05 10:30:00', 'Low', 'Open', 'guardrails');

-- Incidents for session S0049 (safety_score = 68.6) - Multiple incidents with varying severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0049', 'Worker without helmet near excavation', '2025-02-05 12:00:00', 'Moderate', 'Resolved', 'helmet'),
    ('S0049', 'Unsecured gas cylinder', '2025-02-05 14:45:00', 'High', 'Open', 'general'),
    ('S0049', 'Worker falling from ladder', '2025-02-05 16:30:00', 'Critical', 'Open', 'general');

-- Incidents for session S0050 (safety_score = 83.2) - No incidents

-- Incidents for session S0051 (safety_score = 79.2) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0051', 'Worker not wearing vest in low-light conditions', '2025-02-05 18:15:00', 'Moderate', 'Open', 'vest');

-- Incidents for session S0052 (safety_score = 88.2) - No incidents

-- Incidents for session S0053 (safety_score = 76.2) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0053', 'Improper use of forklift', '2025-02-06 10:45:00', 'Moderate', 'Resolved', 'general');

-- Incidents for session S0054 (safety_score = 84.1) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0054', 'Inadequate lighting in work area', '2025-02-06 13:30:00', 'Low', 'Open', 'general');

-- Incidents for session S0055 (safety_score = 83.4) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0055', 'Worker near open trench without fall protection', '2025-02-06 16:15:00', 'Moderate', 'Open', 'guardrails');

-- Incidents for session S0056 (safety_score = 78.7) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0056', 'Worker on roof without harness', '2025-02-06 11:00:00', 'Moderate', 'Resolved', 'harness'),
    ('S0056', 'Exposed electrical wires', '2025-02-06 15:30:00', 'High', 'Open', 'general');

-- Incidents for session S0057 (safety_score = 80.3) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0057', 'Damaged safety net', '2025-02-06 18:00:00', 'Low', 'Resolved', 'general');

-- Incidents for session S0058 (safety_score = 75.6) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0058', 'Worker not wearing proper footwear on slippery surface', '2025-02-07 09:45:00', 'Moderate', 'Open', 'footwear'),
    ('S0058', 'Overloaded crane operation', '2025-02-07 14:20:00', 'High', 'Resolved', 'general');

-- Incidents for session S0059 (safety_score = 81.2) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0059', 'Missing guardrail on platform', '2025-02-07 12:30:00', 'Low', 'Open', 'guardrails');

-- Incidents for session S0060 (safety_score = 86.2) - No incidents

-- Incidents for session S0061 (safety_score = 88.3) - No incidents

-- Incidents for session S0062 (safety_score = 80.2) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0062', 'Worker without gloves handling sharp objects', '2025-02-07 16:15:00', 'Moderate', 'Resolved', 'gloves');

-- Incidents for session S0063 (safety_score = 83.2) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0063', 'Untidy work area with tripping hazards', '2025-02-08 11:00:00', 'Low', 'Open', 'general');

-- Incidents for session S0064 (safety_score = 80.4) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0064', 'Worker not wearing safety harness while working at height', '2025-02-08 14:30:00', 'Moderate', 'Open', 'harness');

-- Incidents for session S0065 (safety_score = 78.7) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0065', 'Improper storage of flammable materials', '2025-02-08 10:15:00', 'Moderate', 'Resolved', 'general'),
    ('S0065', 'Worker using defective equipment', '2025-02-08 16:45:00', 'High', 'Open', 'general');

-- Incidents for session S0066 (safety_score = 84.3) - No incidents

-- Incidents for session S0067 (safety_score = 74.6) - Multiple incidents with varying severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0067', 'Worker without helmet near operating machinery', '2025-02-08 12:30:00', 'Moderate', 'Open', 'helmet'),
    ('S0067', 'Unsafe scaffolding construction', '2025-02-08 15:00:00', 'High', 'Resolved', 'scaffolding'),
    ('S0067', 'Worker struck by falling object', '2025-02-08 17:45:00', 'Critical', 'Open', 'general');

-- Incidents for session S0068 (safety_score = 80.2) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0068', 'Worker not wearing eye protection while welding', '2025-02-09 11:15:00', 'Moderate', 'Resolved', 'gloves');

-- Incidents for session S0069 (safety_score = 85.2) - No incidents

-- Incidents for session S0070 (safety_score = 87.2) - No incidents

-- Incidents for session S0071 (safety_score = 78.2) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0071', 'Worker on ladder without proper support', '2025-02-09 13:00:00', 'Moderate', 'Open', 'general'),
    ('S0071', 'Unsecured load on crane', '2025-02-09 17:30:00', 'High', 'Resolved', 'general');

-- Incidents for session S0072 (safety_score = 81.2) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0072', 'Obstructed emergency exit', '2025-02-09 15:45:00', 'Low', 'Open', 'general');

-- Incidents for session S0073 (safety_score = 84.4) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0073', 'Damaged electrical cord', '2025-02-10 10:30:00', 'Low', 'Resolved', 'general');

-- Incidents for session S0074 (safety_score = 79.7) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0074', 'Worker not wearing gloves while handling hazardous materials', '2025-02-10 13:15:00', 'Moderate', 'Open', 'gloves');

-- Incidents for session S0075 (safety_score = 80.3) - Moderate severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0075', 'Improperly secured scaffolding', '2025-02-10 16:00:00', 'Moderate', 'Resolved', 'scaffolding');

-- Incidents for session S0076 (safety_score = 76.6) - Moderate and High severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0076', 'Worker on roof without fall protection', '2025-02-10 11:45:00', 'Moderate', 'Open', 'harness'),
    ('S0076', 'Fire hazard due to improper storage of flammable liquids', '2025-02-10 15:30:00', 'High', 'Open', 'general');

-- Incidents for session S0077 (safety_score = 82.2) - Low severity
INSERT INTO incidents (session_id, description, incident_time, severity, status, category) VALUES
    ('S0077', 'Missing safety signs', '2025-02-10 18:15:00', 'Low', 'Resolved', 'general');





-- SAFETY SCORE TRENDS

-- Safety score trends for session S0028
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0028', '2025-02-01 08:15:00', 80.0),
    ('S0028', '2025-02-01 09:00:00', 82.5),
    ('S0028', '2025-02-01 09:45:00', 85.0),
    ('S0028', '2025-02-01 10:30:00', 83.5),
    ('S0028', '2025-02-01 11:15:00', 86.0),
    ('S0028', '2025-02-01 12:00:00', 84.0),
    ('S0028', '2025-02-01 12:45:00', 87.5),
    ('S0028', '2025-02-01 13:30:00', 85.5),
    ('S0028', '2025-02-01 14:15:00', 83.0),
    ('S0028', '2025-02-01 15:00:00', 86.5),
    ('S0028', '2025-02-01 15:45:00', 84.5);

-- Safety score trends for session S0029
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0029', '2025-02-01 09:15:00', 75.0),
    ('S0029', '2025-02-01 10:00:00', 78.0),
    ('S0029', '2025-02-01 10:45:00', 81.0),
    ('S0029', '2025-02-01 11:30:00', 79.5),
    ('S0029', '2025-02-01 12:15:00', 82.0),
    ('S0029', '2025-02-01 13:00:00', 80.0),
    ('S0029', '2025-02-01 13:45:00', 83.5),
    ('S0029', '2025-02-01 14:30:00', 81.5),
    ('S0029', '2025-02-01 15:15:00', 79.0),
    ('S0029', '2025-02-01 16:00:00', 82.5),
    ('S0029', '2025-02-01 16:45:00', 80.5);

-- Safety score trends for session S0030
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0030', '2025-02-01 10:15:00', 83.0),
    ('S0030', '2025-02-01 11:00:00', 85.5),
    ('S0030', '2025-02-01 11:45:00', 87.0),
    ('S0030', '2025-02-01 12:30:00', 86.0),
    ('S0030', '2025-02-01 13:15:00', 88.5),
    ('S0030', '2025-02-01 14:00:00', 87.0),
    ('S0030', '2025-02-01 14:45:00', 89.0),
    ('S0030', '2025-02-01 15:30:00', 88.0),
    ('S0030', '2025-02-01 16:15:00', 86.5),
    ('S0030', '2025-02-01 17:00:00', 88.0),
    ('S0030', '2025-02-01 17:45:00', 86.0);

-- Safety score trends for session S0031
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0031', '2025-02-01 11:15:00', 65.0),
    ('S0031', '2025-02-01 12:00:00', 68.5),
    ('S0031', '2025-02-01 12:45:00', 71.0),
    ('S0031', '2025-02-01 13:30:00', 69.5),
    ('S0031', '2025-02-01 14:15:00', 72.0),
    ('S0031', '2025-02-01 15:00:00', 70.0),
    ('S0031', '2025-02-01 15:45:00', 73.5),
    ('S0031', '2025-02-01 16:30:00', 71.5),
    ('S0031', '2025-02-01 17:15:00', 69.0),
    ('S0031', '2025-02-01 18:00:00', 72.5),
    ('S0031', '2025-02-01 18:45:00', 70.5);

-- Safety score trends for session S0032
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0032', '2025-02-01 12:15:00', 78.0),
    ('S0032', '2025-02-01 13:00:00', 80.5),
    ('S0032', '2025-02-01 13:45:00', 82.0),
    ('S0032', '2025-02-01 14:30:00', 81.0),
    ('S0032', '2025-02-01 15:15:00', 83.5),
    ('S0032', '2025-02-01 16:00:00', 82.0),
    ('S0032', '2025-02-01 16:45:00', 84.0),
    ('S0032', '2025-02-01 17:30:00', 83.0),
    ('S0032', '2025-02-01 18:15:00', 81.5),
    ('S0032', '2025-02-01 19:00:00', 83.0),
    ('S0032', '2025-02-01 19:45:00', 81.0);

-- Safety score trends for session S0033
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0033', '2025-02-02 08:15:00', 85.0),
    ('S0033', '2025-02-02 09:00:00', 87.5),
    ('S0033', '2025-02-02 09:45:00', 89.0),
    ('S0033', '2025-02-02 10:30:00', 88.0),
    ('S0033', '2025-02-02 11:15:00', 90.5),
    ('S0033', '2025-02-02 12:00:00', 89.0),
    ('S0033', '2025-02-02 12:45:00', 91.0),
    ('S0033', '2025-02-02 13:30:00', 90.0),
    ('S0033', '2025-02-02 14:15:00', 88.5),
    ('S0033', '2025-02-02 15:00:00', 90.0),
    ('S0033', '2025-02-02 15:45:00', 88.0);

-- Safety score trends for session S0034
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0034', '2025-02-02 09:15:00', 87.0),
    ('S0034', '2025-02-02 10:00:00', 89.5),
    ('S0034', '2025-02-02 10:45:00', 91.0),
    ('S0034', '2025-02-02 11:30:00', 90.0),
    ('S0034', '2025-02-02 12:15:00', 92.5),
    ('S0034', '2025-02-02 13:00:00', 91.0),
    ('S0034', '2025-02-02 13:45:00', 93.0),
    ('S0034', '2025-02-02 14:30:00', 92.0),
    ('S0034', '2025-02-02 15:15:00', 90.5),
    ('S0034', '2025-02-02 16:00:00', 92.0),
    ('S0034', '2025-02-02 16:45:00', 90.0);

-- Safety score trends for session S0035
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0035', '2025-02-02 10:15:00', 74.0),
    ('S0035', '2025-02-02 11:00:00', 76.5),
    ('S0035', '2025-02-02 11:45:00', 78.0),
    ('S0035', '2025-02-02 12:30:00', 77.0),
    ('S0035', '2025-02-02 13:15:00', 79.5),
    ('S0035', '2025-02-02 14:00:00', 78.0),
    ('S0035', '2025-02-02 14:45:00', 80.0),
    ('S0035', '2025-02-02 15:30:00', 79.0),
    ('S0035', '2025-02-02 16:15:00', 77.5),
    ('S0035', '2025-02-02 17:00:00', 79.0),
    ('S0035', '2025-02-02 17:45:00', 77.0);

-- Safety score trends for session S0036
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0036', '2025-02-02 11:15:00', 82.0),
    ('S0036', '2025-02-02 12:00:00', 84.5),
    ('S0036', '2025-02-02 12:45:00', 86.0),
    ('S0036', '2025-02-02 13:30:00', 85.0),
    ('S0036', '2025-02-02 14:15:00', 87.5),
    ('S0036', '2025-02-02 15:00:00', 86.0),
    ('S0036', '2025-02-02 15:45:00', 88.0),
    ('S0036', '2025-02-02 16:30:00', 87.0),
    ('S0036', '2025-02-02 17:15:00', 85.5),
    ('S0036', '2025-02-02 18:00:00', 87.0),
    ('S0036', '2025-02-02 18:45:00', 85.0);

-- Safety score trends for session S0037
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0037', '2025-02-02 12:15:00', 81.0),
    ('S0037', '2025-02-02 13:00:00', 83.5),
    ('S0037', '2025-02-02 13:45:00', 85.0),
    ('S0037', '2025-02-02 14:30:00', 84.0),
    ('S0037', '2025-02-02 15:15:00', 86.5),
    ('S0037', '2025-02-02 16:00:00', 85.0),
    ('S0037', '2025-02-02 16:45:00', 87.0),
    ('S0037', '2025-02-02 17:30:00', 86.0),
    ('S0037', '2025-02-02 18:15:00', 84.5),
    ('S0037', '2025-02-02 19:00:00', 86.0),
    ('S0037', '2025-02-02 19:45:00', 84.0);

-- Safety score trends for session S0038
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0038', '2025-02-03 08:15:00', 78.0),
    ('S0038', '2025-02-03 09:00:00', 80.5),
    ('S0038', '2025-02-03 09:45:00', 82.0),
    ('S0038', '2025-02-03 10:30:00', 81.0),
    ('S0038', '2025-02-03 11:15:00', 83.5),
    ('S0038', '2025-02-03 12:00:00', 82.0),
    ('S0038', '2025-02-03 12:45:00', 84.0),
    ('S0038', '2025-02-03 13:30:00', 83.0),
    ('S0038', '2025-02-03 14:15:00', 81.5),
    ('S0038', '2025-02-03 15:00:00', 83.0),
    ('S0038', '2025-02-03 15:45:00', 81.0);

-- Safety score trends for session S0039
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0039', '2025-02-03 09:15:00', 81.0),
    ('S0039', '2025-02-03 10:00:00', 83.5),
    ('S0039', '2025-02-03 10:45:00', 85.0),
    ('S0039', '2025-02-03 11:30:00', 84.0),
    ('S0039', '2025-02-03 12:15:00', 86.5),
    ('S0039', '2025-02-03 13:00:00', 85.0),
    ('S0039', '2025-02-03 13:45:00', 87.0),
    ('S0039', '2025-02-03 14:30:00', 86.0),
    ('S0039', '2025-02-03 15:15:00', 84.5),
    ('S0039', '2025-02-03 16:00:00', 86.0),
    ('S0039', '2025-02-03 16:45:00', 84.0);

-- Safety score trends for session S0040
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0040', '2025-02-03 10:15:00', 68.0),
    ('S0040', '2025-02-03 11:00:00', 70.5),
    ('S0040', '2025-02-03 11:45:00', 72.0),
    ('S0040', '2025-02-03 12:30:00', 71.0),
    ('S0040', '2025-02-03 13:15:00', 73.5),
    ('S0040', '2025-02-03 14:00:00', 72.0),
    ('S0040', '2025-02-03 14:45:00', 74.0),
    ('S0040', '2025-02-03 15:30:00', 73.0),
    ('S0040', '2025-02-03 16:15:00', 71.5),
    ('S0040', '2025-02-03 17:00:00', 73.0),
    ('S0040', '2025-02-03 17:45:00', 71.0);

-- Safety score trends for session S0041
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0041', '2025-02-03 11:15:00', 83.0),
    ('S0041', '2025-02-03 12:00:00', 85.5),
    ('S0041', '2025-02-03 12:45:00', 87.0),
    ('S0041', '2025-02-03 13:30:00', 86.0),
    ('S0041', '2025-02-03 14:15:00', 88.5),
    ('S0041', '2025-02-03 15:00:00', 87.0),
    ('S0041', '2025-02-03 15:45:00', 89.0),
    ('S0041', '2025-02-03 16:30:00', 88.0),
    ('S0041', '2025-02-03 17:15:00', 86.5),
    ('S0041', '2025-02-03 18:00:00', 88.0),
    ('S0041', '2025-02-03 18:45:00', 86.0);

-- Safety score trends for session S0042
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0042', '2025-02-03 12:15:00', 79.0),
    ('S0042', '2025-02-03 13:00:00', 81.5),
    ('S0042', '2025-02-03 13:45:00', 83.0),
    ('S0042', '2025-02-03 14:30:00', 82.0),
    ('S0042', '2025-02-03 15:15:00', 84.5),
    ('S0042', '2025-02-03 16:00:00', 83.0),
    ('S0042', '2025-02-03 16:45:00', 85.0),
    ('S0042', '2025-02-03 17:30:00', 84.0),
    ('S0042', '2025-02-03 18:15:00', 82.5),
    ('S0042', '2025-02-03 19:00:00', 84.0),
    ('S0042', '2025-02-03 19:45:00', 82.0);

-- Safety score trends for session S0043
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0043', '2025-02-04 08:15:00', 84.0),
    ('S0043', '2025-02-04 09:00:00', 86.5),
    ('S0043', '2025-02-04 09:45:00', 88.0),
    ('S0043', '2025-02-04 10:30:00', 87.0),
    ('S0043', '2025-02-04 11:15:00', 89.5),
    ('S0043', '2025-02-04 12:00:00', 88.0),
    ('S0043', '2025-02-04 12:45:00', 90.0),
    ('S0043', '2025-02-04 13:30:00', 89.0),
    ('S0043', '2025-02-04 14:15:00', 87.5),
    ('S0043', '2025-02-04 15:00:00', 89.0),
    ('S0043', '2025-02-04 15:45:00', 87.0);

-- Safety score trends for session S0044
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0044', '2025-02-04 09:15:00', 77.0),
    ('S0044', '2025-02-04 10:00:00', 79.5),
    ('S0044', '2025-02-04 10:45:00', 81.0),
    ('S0044', '2025-02-04 11:30:00', 80.0),
    ('S0044', '2025-02-04 12:15:00', 82.5),
    ('S0044', '2025-02-04 13:00:00', 81.0),
    ('S0044', '2025-02-04 13:45:00', 83.0),
    ('S0044', '2025-02-04 14:30:00', 82.0),
    ('S0044', '2025-02-04 15:15:00', 80.5),
    ('S0044', '2025-02-04 16:00:00', 82.0),
    ('S0044', '2025-02-04 16:45:00', 80.0);

-- Safety score trends for session S0045
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0045', '2025-02-04 10:15:00', 82.0),
    ('S0045', '2025-02-04 11:00:00', 84.5),
    ('S0045', '2025-02-04 11:45:00', 86.0),
    ('S0045', '2025-02-04 12:30:00', 85.0),
    ('S0045', '2025-02-04 13:15:00', 87.5),
    ('S0045', '2025-02-04 14:00:00', 86.0),
    ('S0045', '2025-02-04 14:45:00', 88.0),
    ('S0045', '2025-02-04 15:30:00', 87.0),
    ('S0045', '2025-02-04 16:15:00', 85.5),
    ('S0045', '2025-02-04 17:00:00', 87.0),
    ('S0045', '2025-02-04 17:45:00', 85.0);

-- Safety score trends for session S0046
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0046', '2025-02-04 11:15:00', 82.0),
    ('S0046', '2025-02-04 12:00:00', 84.5),
    ('S0046', '2025-02-04 12:45:00', 86.0),
    ('S0046', '2025-02-04 13:30:00', 85.0),
    ('S0046', '2025-02-04 14:15:00', 87.5),
    ('S0046', '2025-02-04 15:00:00', 86.0),
    ('S0046', '2025-02-04 15:45:00', 88.0),
    ('S0046', '2025-02-04 16:30:00', 87.0),
    ('S0046', '2025-02-04 17:15:00', 85.5),
    ('S0046', '2025-02-04 18:00:00', 87.0),
    ('S0046', '2025-02-04 18:45:00', 85.0);

-- Safety score trends for session S0047
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0047', '2025-02-04 12:15:00', 78.0),
    ('S0047', '2025-02-04 13:00:00', 80.5),
    ('S0047', '2025-02-04 13:45:00', 82.0),
    ('S0047', '2025-02-04 14:30:00', 81.0),
    ('S0047', '2025-02-04 15:15:00', 83.5),
    ('S0047', '2025-02-04 16:00:00', 82.0),
    ('S0047', '2025-02-04 16:45:00', 84.0),
    ('S0047', '2025-02-04 17:30:00', 83.0),
    ('S0047', '2025-02-04 18:15:00', 81.5),
    ('S0047', '2025-02-04 19:00:00', 83.0),
    ('S0047', '2025-02-04 19:45:00', 81.0);

-- Safety score trends for session S0048
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0048', '2025-02-05 08:15:00', 80.0),
    ('S0048', '2025-02-05 09:00:00', 82.5),
    ('S0048', '2025-02-05 09:45:00', 84.0),
    ('S0048', '2025-02-05 10:30:00', 83.0),
    ('S0048', '2025-02-05 11:15:00', 85.5),
    ('S0048', '2025-02-05 12:00:00', 84.0),
    ('S0048', '2025-02-05 12:45:00', 86.0),
    ('S0048', '2025-02-05 13:30:00', 85.0),
    ('S0048', '2025-02-05 14:15:00', 83.5),
    ('S0048', '2025-02-05 15:00:00', 85.0),
    ('S0048', '2025-02-05 15:45:00', 83.0);

-- Safety score trends for session S0049
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0049', '2025-02-05 09:15:00', 66.0),
    ('S0049', '2025-02-05 10:00:00', 68.5),
    ('S0049', '2025-02-05 10:45:00', 70.0),
    ('S0049', '2025-02-05 11:30:00', 69.0),
    ('S0049', '2025-02-05 12:15:00', 71.5),
    ('S0049', '2025-02-05 13:00:00', 70.0),
    ('S0049', '2025-02-05 13:45:00', 72.0),
    ('S0049', '2025-02-05 14:30:00', 71.0),
    ('S0049', '2025-02-05 15:15:00', 69.5),
    ('S0049', '2025-02-05 16:00:00', 71.0),
    ('S0049', '2025-02-05 16:45:00', 69.0);

-- Safety score trends for session S0050
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0050', '2025-02-05 10:15:00', 81.0),
    ('S0050', '2025-02-05 11:00:00', 83.5),
    ('S0050', '2025-02-05 11:45:00', 85.0),
    ('S0050', '2025-02-05 12:30:00', 84.0),
    ('S0050', '2025-02-05 13:15:00', 86.5),
    ('S0050', '2025-02-05 14:00:00', 85.0),
    ('S0050', '2025-02-05 14:45:00', 87.0),
    ('S0050', '2025-02-05 15:30:00', 86.0),
    ('S0050', '2025-02-05 16:15:00', 84.5),
    ('S0050', '2025-02-05 17:00:00', 86.0),
    ('S0050', '2025-02-05 17:45:00', 84.0);

-- Safety score trends for session S0051
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0051', '2025-02-05 11:15:00', 77.0),
    ('S0051', '2025-02-05 12:00:00', 79.5),
    ('S0051', '2025-02-05 12:45:00', 81.0),
    ('S0051', '2025-02-05 13:30:00', 80.0),
    ('S0051', '2025-02-05 14:15:00', 82.5),
    ('S0051', '2025-02-05 15:00:00', 81.0),
    ('S0051', '2025-02-05 15:45:00', 83.0),
    ('S0051', '2025-02-05 16:30:00', 82.0),
    ('S0051', '2025-02-05 17:15:00', 80.5),
    ('S0051', '2025-02-05 18:00:00', 82.0),
    ('S0051', '2025-02-05 18:45:00', 80.0);

-- Safety score trends for session S0052
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0052', '2025-02-05 12:15:00', 86.0),
    ('S0052', '2025-02-05 13:00:00', 88.5),
    ('S0052', '2025-02-05 13:45:00', 90.0),
    ('S0052', '2025-02-05 14:30:00', 89.0),
    ('S0052', '2025-02-05 15:15:00', 91.5),
    ('S0052', '2025-02-05 16:00:00', 90.0),
    ('S0052', '2025-02-05 16:45:00', 92.0),
    ('S0052', '2025-02-05 17:30:00', 91.0),
    ('S0052', '2025-02-05 18:15:00', 89.5),
    ('S0052', '2025-02-05 19:00:00', 91.0),
    ('S0052', '2025-02-05 19:45:00', 89.0);

-- Safety score trends for session S0053
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0053', '2025-02-06 08:15:00', 74.0),
    ('S0053', '2025-02-06 09:00:00', 76.5),
    ('S0053', '2025-02-06 09:45:00', 78.0),
    ('S0053', '2025-02-06 10:30:00', 77.0),
    ('S0053', '2025-02-06 11:15:00', 79.5),
    ('S0053', '2025-02-06 12:00:00', 78.0),
    ('S0053', '2025-02-06 12:45:00', 80.0),
    ('S0053', '2025-02-06 13:30:00', 79.0),
    ('S0053', '2025-02-06 14:15:00', 77.5),
    ('S0053', '2025-02-06 15:00:00', 79.0),
    ('S0053', '2025-02-06 15:45:00', 77.0);

-- Safety score trends for session S0054
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0054', '2025-02-06 09:15:00', 80.0),
    ('S0054', '2025-02-06 10:00:00', 82.5),
    ('S0054', '2025-02-06 10:45:00', 84.0),
    ('S0054', '2025-02-06 11:30:00', 83.0),
    ('S0054', '2025-02-06 12:15:00', 85.5),
    ('S0054', '2025-02-06 13:00:00', 84.0),
    ('S0054', '2025-02-06 13:45:00', 86.0),
    ('S0054', '2025-02-06 14:30:00', 85.0),
    ('S0054', '2025-02-06 15:15:00', 83.5),
    ('S0054', '2025-02-06 16:00:00', 85.0),
    ('S0054', '2025-02-06 16:45:00', 83.0);

-- Safety score trends for session S0055
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0055', '2025-02-06 10:15:00', 81.0),
    ('S0055', '2025-02-06 11:00:00', 83.5),
    ('S0055', '2025-02-06 11:45:00', 85.0),
    ('S0055', '2025-02-06 12:30:00', 84.0),
    ('S0055', '2025-02-06 13:15:00', 86.5),
    ('S0055', '2025-02-06 14:00:00', 85.0),
    ('S0055', '2025-02-06 14:45:00', 87.0),
    ('S0055', '2025-02-06 15:30:00', 86.0),
    ('S0055', '2025-02-06 16:15:00', 84.5),
    ('S0055', '2025-02-06 17:00:00', 86.0),
    ('S0055', '2025-02-06 17:45:00', 84.0);

-- Safety score trends for session S0056
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0056', '2025-02-06 11:15:00', 76.0),
    ('S0056', '2025-02-06 12:00:00', 78.5),
    ('S0056', '2025-02-06 12:45:00', 80.0),
    ('S0056', '2025-02-06 13:30:00', 79.0),
    ('S0056', '2025-02-06 14:15:00', 81.5),
    ('S0056', '2025-02-06 15:00:00', 80.0),
    ('S0056', '2025-02-06 15:45:00', 82.0),
    ('S0056', '2025-02-06 16:30:00', 81.0),
    ('S0056', '2025-02-06 17:15:00', 79.5),
    ('S0056', '2025-02-06 18:00:00', 81.0),
    ('S0056', '2025-02-06 18:45:00', 79.0);

-- Safety score trends for session S0057
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0057', '2025-02-06 12:15:00', 78.0),
    ('S0057', '2025-02-06 13:00:00', 80.5),
    ('S0057', '2025-02-06 13:45:00', 82.0),
    ('S0057', '2025-02-06 14:30:00', 81.0),
    ('S0057', '2025-02-06 15:15:00', 83.5),
    ('S0057', '2025-02-06 16:00:00', 82.0),
    ('S0057', '2025-02-06 16:45:00', 84.0),
    ('S0057', '2025-02-06 17:30:00', 83.0),
    ('S0057', '2025-02-06 18:15:00', 81.5),
    ('S0057', '2025-02-06 19:00:00', 83.0),
    ('S0057', '2025-02-06 19:45:00', 81.0);

-- Safety score trends for session S0058
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0058', '2025-02-07 08:15:00', 73.0),
    ('S0058', '2025-02-07 09:00:00', 75.5),
    ('S0058', '2025-02-07 09:45:00', 77.0),
    ('S0058', '2025-02-07 10:30:00', 76.0),
    ('S0058', '2025-02-07 11:15:00', 78.5),
    ('S0058', '2025-02-07 12:00:00', 77.0),
    ('S0058', '2025-02-07 12:45:00', 79.0),
    ('S0058', '2025-02-07 13:30:00', 78.0),
    ('S0058', '2025-02-07 14:15:00', 76.5),
    ('S0058', '2025-02-07 15:00:00', 78.0),
    ('S0058', '2025-02-07 15:45:00', 76.0);

-- Safety score trends for session S0059
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0059', '2025-02-07 09:15:00', 79.0),
    ('S0059', '2025-02-07 10:00:00', 81.5),
    ('S0059', '2025-02-07 10:45:00', 83.0),
    ('S0059', '2025-02-07 11:30:00', 82.0),
    ('S0059', '2025-02-07 12:15:00', 84.5),
    ('S0059', '2025-02-07 13:00:00', 83.0),
    ('S0059', '2025-02-07 13:45:00', 85.0),
    ('S0059', '2025-02-07 14:30:00', 84.0),
    ('S0059', '2025-02-07 15:15:00', 82.5),
    ('S0059', '2025-02-07 16:00:00', 84.0),
    ('S0059', '2025-02-07 16:45:00', 82.0);

-- Safety score trends for session S0060
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0060', '2025-02-07 10:15:00', 84.0),
    ('S0060', '2025-02-07 11:00:00', 86.5),
    ('S0060', '2025-02-07 11:45:00', 88.0),
    ('S0060', '2025-02-07 12:30:00', 87.0),
    ('S0060', '2025-02-07 13:15:00', 89.5),
    ('S0060', '2025-02-07 14:00:00', 88.0),
    ('S0060', '2025-02-07 14:45:00', 90.0),
    ('S0060', '2025-02-07 15:30:00', 89.0),
    ('S0060', '2025-02-07 16:15:00', 87.5),
    ('S0060', '2025-02-07 17:00:00', 89.0),
    ('S0060', '2025-02-07 17:45:00', 87.0);

-- Safety score trends for session S0061
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0061', '2025-02-07 11:15:00', 86.0),
    ('S0061', '2025-02-07 12:00:00', 88.5),
    ('S0061', '2025-02-07 12:45:00', 90.0),
    ('S0061', '2025-02-07 13:30:00', 89.0),
    ('S0061', '2025-02-07 14:15:00', 91.5),
    ('S0061', '2025-02-07 15:00:00', 90.0),
    ('S0061', '2025-02-07 15:45:00', 92.0),
    ('S0061', '2025-02-07 16:30:00', 91.0),
    ('S0061', '2025-02-07 17:15:00', 89.5),
    ('S0061', '2025-02-07 18:00:00', 91.0),
    ('S0061', '2025-02-07 18:45:00', 89.0);

-- Safety score trends for session S0062
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0062', '2025-02-07 12:15:00', 78.0),
    ('S0062', '2025-02-07 13:00:00', 80.5),
    ('S0062', '2025-02-07 13:45:00', 82.0),
    ('S0062', '2025-02-07 14:30:00', 81.0),
    ('S0062', '2025-02-07 15:15:00', 83.5),
    ('S0062', '2025-02-07 16:00:00', 82.0),
    ('S0062', '2025-02-07 16:45:00', 84.0),
    ('S0062', '2025-02-07 17:30:00', 83.0),
    ('S0062', '2025-02-07 18:15:00', 81.5),
    ('S0062', '2025-02-07 19:00:00', 83.0),
    ('S0062', '2025-02-07 19:45:00', 81.0);

-- Safety score trends for session S0063
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0063', '2025-02-08 08:15:00', 81.0),
    ('S0063', '2025-02-08 09:00:00', 83.5),
    ('S0063', '2025-02-08 09:45:00', 85.0),
    ('S0063', '2025-02-08 10:30:00', 84.0),
    ('S0063', '2025-02-08 11:15:00', 86.5),
    ('S0063', '2025-02-08 12:00:00', 85.0),
    ('S0063', '2025-02-08 12:45:00', 87.0),
    ('S0063', '2025-02-08 13:30:00', 86.0),
    ('S0063', '2025-02-08 14:15:00', 84.5),
    ('S0063', '2025-02-08 15:00:00', 86.0),
    ('S0063', '2025-02-08 15:45:00', 84.0);

-- Safety score trends for session S0064
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0064', '2025-02-08 09:15:00', 78.0),
    ('S0064', '2025-02-08 10:00:00', 80.5),
    ('S0064', '2025-02-08 10:45:00', 82.0),
    ('S0064', '2025-02-08 11:30:00', 81.0),
    ('S0064', '2025-02-08 12:15:00', 83.5),
    ('S0064', '2025-02-08 13:00:00', 82.0),
    ('S0064', '2025-02-08 13:45:00', 84.0),
    ('S0064', '2025-02-08 14:30:00', 83.0),
    ('S0064', '2025-02-08 15:15:00', 81.5),
    ('S0064', '2025-02-08 16:00:00', 83.0),
    ('S0064', '2025-02-08 16:45:00', 81.0);

-- Safety score trends for session S0065
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0065', '2025-02-08 10:15:00', 76.0),
    ('S0065', '2025-02-08 11:00:00', 78.5),
    ('S0065', '2025-02-08 11:45:00', 80.0),
    ('S0065', '2025-02-08 12:30:00', 79.0),
    ('S0065', '2025-02-08 13:15:00', 81.5),
    ('S0065', '2025-02-08 14:00:00', 80.0),
    ('S0065', '2025-02-08 14:45:00', 82.0),
    ('S0065', '2025-02-08 15:30:00', 81.0),
    ('S0065', '2025-02-08 16:15:00', 79.5),
    ('S0065', '2025-02-08 17:00:00', 81.0),
    ('S0065', '2025-02-08 17:45:00', 79.0);

-- Safety score trends for session S0066
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0066', '2025-02-08 11:15:00', 82.0),
    ('S0066', '2025-02-08 12:00:00', 84.5),
    ('S0066', '2025-02-08 12:45:00', 86.0),
    ('S0066', '2025-02-08 13:30:00', 85.0),
    ('S0066', '2025-02-08 14:15:00', 87.5),
    ('S0066', '2025-02-08 15:00:00', 86.0),
    ('S0066', '2025-02-08 15:45:00', 88.0),
    ('S0066', '2025-02-08 16:30:00', 87.0),
    ('S0066', '2025-02-08 17:15:00', 85.5),
    ('S0066', '2025-02-08 18:00:00', 87.0),
    ('S0066', '2025-02-08 18:45:00', 85.0);

-- Safety score trends for session S0067
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0067', '2025-02-08 12:15:00', 72.0),
    ('S0067', '2025-02-08 13:00:00', 74.5),
    ('S0067', '2025-02-08 13:45:00', 76.0),
    ('S0067', '2025-02-08 14:30:00', 75.0),
    ('S0067', '2025-02-08 15:15:00', 77.5),
    ('S0067', '2025-02-08 16:00:00', 76.0),
    ('S0067', '2025-02-08 16:45:00', 78.0),
    ('S0067', '2025-02-08 17:30:00', 77.0),
    ('S0067', '2025-02-08 18:15:00', 75.5),
    ('S0067', '2025-02-08 19:00:00', 77.0),
    ('S0067', '2025-02-08 19:45:00', 75.0);

-- Safety score trends for session S0068
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0068', '2025-02-09 08:15:00', 78.0),
    ('S0068', '2025-02-09 09:00:00', 80.5),
    ('S0068', '2025-02-09 09:45:00', 82.0),
    ('S0068', '2025-02-09 10:30:00', 81.0),
    ('S0068', '2025-02-09 11:15:00', 83.5),
    ('S0068', '2025-02-09 12:00:00', 82.0),
    ('S0068', '2025-02-09 12:45:00', 84.0),
    ('S0068', '2025-02-09 13:30:00', 83.0),
    ('S0068', '2025-02-09 14:15:00', 81.5),
    ('S0068', '2025-02-09 15:00:00', 83.0),
    ('S0068', '2025-02-09 15:45:00', 81.0);

-- Safety score trends for session S0069
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0069', '2025-02-09 09:15:00', 83.0),
    ('S0069', '2025-02-09 10:00:00', 85.5),
    ('S0069', '2025-02-09 10:45:00', 87.0),
    ('S0069', '2025-02-09 11:30:00', 86.0),
    ('S0069', '2025-02-09 12:15:00', 88.5),
    ('S0069', '2025-02-09 13:00:00', 87.0),
    ('S0069', '2025-02-09 13:45:00', 89.0),
    ('S0069', '2025-02-09 14:30:00', 88.0),
    ('S0069', '2025-02-09 15:15:00', 86.5),
    ('S0069', '2025-02-09 16:00:00', 88.0),
    ('S0069', '2025-02-09 16:45:00', 86.0);

-- Safety score trends for session S0070
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0070', '2025-02-09 10:15:00', 85.0),
    ('S0070', '2025-02-09 11:00:00', 87.5),
    ('S0070', '2025-02-09 11:45:00', 89.0),
    ('S0070', '2025-02-09 12:30:00', 88.0),
    ('S0070', '2025-02-09 13:15:00', 90.5),
    ('S0070', '2025-02-09 14:00:00', 89.0),
    ('S0070', '2025-02-09 14:45:00', 91.0),
    ('S0070', '2025-02-09 15:30:00', 90.0),
    ('S0070', '2025-02-09 16:15:00', 88.5),
    ('S0070', '2025-02-09 17:00:00', 90.0),
    ('S0070', '2025-02-09 17:45:00', 88.0);

-- Safety score trends for session S0071
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0071', '2025-02-09 11:15:00', 76.0),
    ('S0071', '2025-02-09 12:00:00', 78.5),
    ('S0071', '2025-02-09 12:45:00', 80.0),
    ('S0071', '2025-02-09 13:30:00', 79.0),
    ('S0071', '2025-02-09 14:15:00', 81.5),
    ('S0071', '2025-02-09 15:00:00', 80.0),
    ('S0071', '2025-02-09 15:45:00', 82.0),
    ('S0071', '2025-02-09 16:30:00', 81.0),
    ('S0071', '2025-02-09 17:15:00', 79.5),
    ('S0071', '2025-02-09 18:00:00', 81.0),
    ('S0071', '2025-02-09 18:45:00', 79.0);

-- Safety score trends for session S0072
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0072', '2025-02-09 12:15:00', 79.0),
    ('S0072', '2025-02-09 13:00:00', 81.5),
    ('S0072', '2025-02-09 13:45:00', 83.0),
    ('S0072', '2025-02-09 14:30:00', 82.0),
    ('S0072', '2025-02-09 15:15:00', 84.5),
    ('S0072', '2025-02-09 16:00:00', 83.0),
    ('S0072', '2025-02-09 16:45:00', 85.0),
    ('S0072', '2025-02-09 17:30:00', 84.0),
    ('S0072', '2025-02-09 18:15:00', 82.5),
    ('S0072', '2025-02-09 19:00:00', 84.0),
    ('S0072', '2025-02-09 19:45:00', 82.0);

-- Safety score trends for session S0073
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0073', '2025-02-10 08:15:00', 82.0),
    ('S0073', '2025-02-10 09:00:00', 84.5),
    ('S0073', '2025-02-10 09:45:00', 86.0),
    ('S0073', '2025-02-10 10:30:00', 85.0),
    ('S0073', '2025-02-10 11:15:00', 87.5),
    ('S0073', '2025-02-10 12:00:00', 86.0),
    ('S0073', '2025-02-10 12:45:00', 88.0),
    ('S0073', '2025-02-10 13:30:00', 87.0),
    ('S0073', '2025-02-10 14:15:00', 85.5),
    ('S0073', '2025-02-10 15:00:00', 87.0),
    ('S0073', '2025-02-10 15:45:00', 85.0);

-- Safety score trends for session S0074
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0074', '2025-02-10 09:15:00', 77.0),
    ('S0074', '2025-02-10 10:00:00', 79.5),
    ('S0074', '2025-02-10 10:45:00', 81.0),
    ('S0074', '2025-02-10 11:30:00', 80.0),
    ('S0074', '2025-02-10 12:15:00', 82.5),
    ('S0074', '2025-02-10 13:00:00', 81.0),
    ('S0074', '2025-02-10 13:45:00', 83.0),
    ('S0074', '2025-02-10 14:30:00', 82.0),
    ('S0074', '2025-02-10 15:15:00', 80.5),
    ('S0074', '2025-02-10 16:00:00', 82.0),
    ('S0074', '2025-02-10 16:45:00', 80.0);

-- Safety score trends for session S0075
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0075', '2025-02-10 10:15:00', 78.0),
    ('S0075', '2025-02-10 11:00:00', 80.5),
    ('S0075', '2025-02-10 11:45:00', 82.0),
    ('S0075', '2025-02-10 12:30:00', 81.0),
    ('S0075', '2025-02-10 13:15:00', 83.5),
    ('S0075', '2025-02-10 14:00:00', 82.0),
    ('S0075', '2025-02-10 14:45:00', 84.0),
    ('S0075', '2025-02-10 15:30:00', 83.0),
    ('S0075', '2025-02-10 16:15:00', 81.5),
    ('S0075', '2025-02-10 17:00:00', 83.0),
    ('S0075', '2025-02-10 17:45:00', 81.0);

-- Safety score trends for session S0076
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0076', '2025-02-10 11:15:00', 74.0),
    ('S0076', '2025-02-10 12:00:00', 76.5),
    ('S0076', '2025-02-10 12:45:00', 78.0),
    ('S0076', '2025-02-10 13:30:00', 77.0),
    ('S0076', '2025-02-10 14:15:00', 79.5),
    ('S0076', '2025-02-10 15:00:00', 78.0),
    ('S0076', '2025-02-10 15:45:00', 80.0),
    ('S0076', '2025-02-10 16:30:00', 79.0),
    ('S0076', '2025-02-10 17:15:00', 77.5),
    ('S0076', '2025-02-10 18:00:00', 79.0),
    ('S0076', '2025-02-10 18:45:00', 77.0);

-- Safety score trends for session S0077
INSERT INTO safety_score_trends (session_id, "timestamp", score) VALUES
    ('S0077', '2025-02-10 12:15:00', 80.0),
    ('S0077', '2025-02-10 13:00:00', 82.5),
    ('S0077', '2025-02-10 13:45:00', 84.0),
    ('S0077', '2025-02-10 14:30:00', 83.0),
    ('S0077', '2025-02-10 15:15:00', 85.5),
    ('S0077', '2025-02-10 16:00:00', 84.0),
    ('S0077', '2025-02-10 16:45:00', 86.0),
    ('S0077', '2025-02-10 17:30:00', 85.0),
    ('S0077', '2025-02-10 18:15:00', 83.5),
    ('S0077', '2025-02-10 19:00:00', 85.0),
    ('S0077', '2025-02-10 19:45:00', 83.0);



-- SAFETY SCORE DISTRIBUTION

-- Safety score distribution for session S0028
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0028', 80.0, 85.0, 88.0, 90.0, 85.0, 88.0, 80.0);

-- Safety score distribution for session S0029
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0029', 75.0, 80.0, 78.0, 85.0, 80.0, 82.0, 70.0);

-- Safety score distribution for session S0030
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0030', 88.0, 90.0, 92.0, 95.0, 85.0, 90.0, 90.0);

-- Safety score distribution for session S0031
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0031', 65.0, 70.0, 68.0, 75.0, 70.0, 78.0, 60.0);

-- Safety score distribution for session S0032
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0032', 80.0, 75.0, 85.0, 88.0, 80.0, 85.0, 82.0);

-- Safety score distribution for session S0033
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0033', 85.0, 90.0, 88.0, 92.0, 88.0, 90.0, 85.0);

-- Safety score distribution for session S0034
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0034', 90.0, 92.0, 95.0, 98.0, 92.0, 94.0, 90.0);

-- Safety score distribution for session S0035
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0035', 70.0, 78.0, 75.0, 80.0, 75.0, 80.0, 70.0);

-- Safety score distribution for session S0036
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0036', 85.0, 88.0, 85.0, 90.0, 85.0, 88.0, 82.0);

-- Safety score distribution for session S0037
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0037', 80.0, 85.0, 82.0, 88.0, 82.0, 80.0, 80.0);

-- Safety score distribution for session S0038
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0038', 80.0, 82.0, 80.0, 75.0, 80.0, 85.0, 80.0);

-- Safety score distribution for session S0039
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0039', 82.0, 85.0, 88.0, 90.0, 85.0, 88.0, 85.0);

-- Safety score distribution for session S0040
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0040', 70.0, 75.0, 70.0, 78.0, 70.0, 75.0, 65.0);

-- Safety score distribution for session S0041
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0041', 85.0, 90.0, 88.0, 92.0, 88.0, 90.0, 85.0);

-- Safety score distribution for session S0042
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0042', 80.0, 85.0, 82.0, 88.0, 82.0, 80.0, 80.0);

-- Safety score distribution for session S0043
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0043', 85.0, 88.0, 85.0, 90.0, 85.0, 88.0, 85.0);

-- Safety score distribution for session S0044
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0044', 75.0, 80.0, 78.0, 82.0, 78.0, 82.0, 75.0);

-- Safety score distribution for session S0045
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0045', 82.0, 85.0, 88.0, 90.0, 85.0, 88.0, 82.0);

-- Safety score distribution for session S0046
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0046', 80.0, 85.0, 82.0, 88.0, 82.0, 80.0, 80.0);

-- Safety score distribution for session S0047
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0047', 78.0, 80.0, 80.0, 75.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0048
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0048', 80.0, 82.0, 85.0, 88.0, 82.0, 80.0, 80.0);

-- Safety score distribution for session S0049
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0049', 65.0, 70.0, 68.0, 75.0, 70.0, 78.0, 65.0);

-- Safety score distribution for session S0050
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0050', 85.0, 88.0, 90.0, 92.0, 88.0, 90.0, 85.0);

-- Safety score distribution for session S0051
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0051', 75.0, 80.0, 75.0, 80.0, 80.0, 80.0, 75.0);

-- Safety score distribution for session S0052
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0052', 90.0, 92.0, 95.0, 98.0, 92.0, 94.0, 90.0);

-- Safety score distribution for session S0053
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0053', 70.0, 75.0, 78.0, 80.0, 78.0, 80.0, 70.0);

-- Safety score distribution for session S0054
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0054', 80.0, 85.0, 85.0, 88.0, 85.0, 88.0, 80.0);

-- Safety score distribution for session S0055
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0055', 80.0, 82.0, 85.0, 88.0, 82.0, 80.0, 80.0);

-- Safety score distribution for session S0056
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0056', 75.0, 80.0, 78.0, 85.0, 80.0, 75.0, 70.0);

-- Safety score distribution for session S0057
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0057', 78.0, 80.0, 82.0, 85.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0058
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0058', 70.0, 70.0, 75.0, 80.0, 75.0, 80.0, 70.0);

-- Safety score distribution for session S0059
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0059', 80.0, 82.0, 80.0, 85.0, 80.0, 80.0, 80.0);

-- Safety score distribution for session S0060
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0060', 85.0, 90.0, 88.0, 92.0, 88.0, 90.0, 85.0);

-- Safety score distribution for session S0061
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0061', 88.0, 90.0, 92.0, 95.0, 90.0, 92.0, 88.0);

-- Safety score distribution for session S0062
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0062', 78.0, 80.0, 80.0, 75.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0063
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0063', 80.0, 82.0, 85.0, 88.0, 85.0, 85.0, 80.0);

-- Safety score distribution for session S0064
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0064', 78.0, 80.0, 80.0, 85.0, 80.0, 80.0, 75.0);

-- Safety score distribution for session S0065
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0065', 75.0, 80.0, 78.0, 82.0, 78.0, 80.0, 70.0);

-- Safety score distribution for session S0066
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0066', 82.0, 85.0, 88.0, 90.0, 85.0, 88.0, 82.0);

-- Safety score distribution for session S0067
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0067', 70.0, 75.0, 72.0, 78.0, 70.0, 78.0, 68.0);

-- Safety score distribution for session S0068
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0068', 78.0, 80.0, 80.0, 75.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0069
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0069', 85.0, 88.0, 90.0, 92.0, 88.0, 90.0, 85.0);

-- Safety score distribution for session S0070
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0070', 88.0, 90.0, 92.0, 95.0, 90.0, 92.0, 88.0);

-- Safety score distribution for session S0071
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0071', 75.0, 80.0, 78.0, 82.0, 80.0, 80.0, 75.0);

-- Safety score distribution for session S0072
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0072', 80.0, 82.0, 85.0, 88.0, 82.0, 85.0, 80.0);

-- Safety score distribution for session S0073
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0073', 82.0, 85.0, 88.0, 90.0, 85.0, 88.0, 82.0);

-- Safety score distribution for session S0074
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0074', 78.0, 80.0, 80.0, 75.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0075
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0075', 78.0, 80.0, 82.0, 85.0, 80.0, 82.0, 78.0);

-- Safety score distribution for session S0076
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0076', 70.0, 75.0, 78.0, 80.0, 75.0, 75.0, 70.0);

-- Safety score distribution for session S0077
INSERT INTO safety_score_distribution (session_id, helmet_score, footwear_score, vest_score, gloves_score, scaffolding_score, guardrails_score, harness_score) VALUES
    ('S0077', 80.0, 82.0, 85.0, 88.0, 82.0, 85.0, 80.0);

-------------------------------------------------------------------------------------

-- Update safetyScore in construction_sites

UPDATE construction_sites
SET safetyScore = subquery.avg_safety_score
FROM (
    SELECT s.site_id, AVG(s.safety_score) AS avg_safety_score
    FROM sessions s
    GROUP BY s.site_id
) AS subquery
WHERE construction_sites.site_id = subquery.site_id;