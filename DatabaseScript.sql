-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------
-- ELLIPSIS DATABASE CREATION SCRIPT
-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------



-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------
-- Section 1: Table Creation
-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------



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

-- Create a custom ENUM type for incident category
CREATE TYPE incident_category AS ENUM ('Helmet', 'Vest', 'Gloves', 'Shoes', 'Harness', 'Scaffolding', 'Guardrail');

-- Alter the 'category' column in 'incidents' to use the 'incident_category' ENUM type
ALTER TABLE incidents ALTER COLUMN category TYPE incident_category USING category::TEXT::incident_category;

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



-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------
-- Section 2: Data Insertion
-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------



-- ----------------------------------------------------------------------
-- CONSTRUCTION SITES
-- ----------------------------------------------------------------------

INSERT INTO construction_sites (name, status, safetyScore, snapshots) VALUES
    ('Olgoo Project', 'Active', 88.5, '{
        "https://i.postimg.cc/pTKwWytZ/Olgoo.jpg",
        "https://i.postimg.cc/TPrxfPZk/vlcsnap-2025-03-03-12h24m52s504.png",
        "https://i.postimg.cc/3x07f19Q/vlcsnap-2025-03-03-12h24m55s545.png",
		"https://i.postimg.cc/9FMcZC7M/vlcsnap-2025-03-03-12h24m58s643.png",
		"https://i.postimg.cc/D0fnCKpx/vlcsnap-2025-03-03-12h25m01s527.png"
    }'::TEXT),
    ('Fereshteh 24', 'Inactive', 84.2, '{
        "https://i.postimg.cc/mr5t7LhC/fereshteh.jpg",
		"https://i.postimg.cc/kXXgsWk7/vlcsnap-2025-03-03-12h25m04s926.png",
		"https://i.postimg.cc/sx3DtWx9/vlcsnap-2025-03-03-12h25m08s769.png",
		"https://i.postimg.cc/RF50LyzY/vlcsnap-2025-03-03-12h25m11s995.png",
        "https://i.postimg.cc/vZKTcD2b/vlcsnap-2025-03-03-12h25m15s879.png"
    }'::TEXT),
    ('Deniz Project', 'Active', 90.1, '{
        "https://i.postimg.cc/5N1cXjrC/deniz.jpg",
        "https://i.postimg.cc/QNgF08CJ/vlcsnap-2025-03-03-12h25m18s546.png",
        "https://i.postimg.cc/gjKrJDQT/vlcsnap-2025-03-03-12h25m22s059.png",
        "https://i.postimg.cc/sxzvs86W/vlcsnap-2025-03-03-12h25m33s311.png",
		"https://i.postimg.cc/NFvrLLM5/vlcsnap-2025-03-03-12h25m36s534.png"
    }'::TEXT),
    ('Kamran Project', 'Inactive', 82.0, '{
     "https://i.postimg.cc/vB9jBdLh/kamran.jpg",
        "https://i.postimg.cc/0N3SRV1G/vlcsnap-2025-03-03-12h25m41s085.png",
        "https://i.postimg.cc/RFHHMwvk/vlcsnap-2025-03-03-12h25m44s897.png",
        "https://i.postimg.cc/5tjzRZTN/vlcsnap-2025-03-03-12h25m48s349.png",
		"https://i.postimg.cc/50Yw6ZSk/vlcsnap-2025-03-03-12h56m09s907.png"
	}'::TEXT),
    ('Dashtyar', 'Inactive', 87.4, '{
        "https://i.postimg.cc/Dy5Nm6s9/dashtyar.jpg"
		"https://i.postimg.cc/3wwjHy4h/vlcsnap-2025-03-03-12h56m12s207.png",
        "https://i.postimg.cc/sDp4PCdk/vlcsnap-2025-03-03-13h01m55s959.png",
        "https://i.postimg.cc/QNKbtW6x/vlcsnap-2025-03-03-13h02m00s327.png",
		"https://i.postimg.cc/1RbvcKgq/vlcsnap-2025-03-03-13h02m05s131.png"
    }'::TEXT),
    ('Manzariyeh', 'Active', 89.8, '{
        "https://i.postimg.cc/YCkvNDR2/manzariyeh.jpg",
		"https://i.postimg.cc/4xgwjNQ4/vlcsnap-2025-03-03-13h02m24s595.png",
        "https://i.postimg.cc/jdNZ8JNk/vlcsnap-2025-03-03-13h02m27s751.png",
        "https://i.postimg.cc/RCWPHY0m/vlcsnap-2025-03-03-13h02m31s175.png",
		"https://i.postimg.cc/BnTHFTD4/vlcsnap-2025-03-03-13h02m42s544.png"
    }'::TEXT),
    ('Sahra Project', 'Inactive', 91.3, '{
        "https://i.postimg.cc/sf0SSGT6/image.jpg",
		"https://i.postimg.cc/ZYQ8zK4t/vlcsnap-2025-03-03-13h02m45s003.png",
        "https://i.postimg.cc/rs7x1gQF/vlcsnap-2025-03-03-13h02m47s307.png",
        "https://i.postimg.cc/QCFcKvgy/vlcsnap-2025-03-03-13h02m58s786.png",
		"https://i.postimg.cc/BnTHFTD4/vlcsnap-2025-03-03-13h02m42s544.png"
    }'::TEXT),
    ('Sibeh Project', 'Active', 86.0, '{
        "https://i.postimg.cc/ry1gNs2S/sineh.jpg",
		"https://i.postimg.cc/CLdcbQLY/vlcsnap-2025-03-03-13h03m02s721.png",
        "https://i.postimg.cc/W4cSLpmb/vlcsnap-2025-03-03-13h03m05s746.png",
        "https://i.postimg.cc/3wj1KM9j/vlcsnap-2025-03-03-13h03m07s539.png",
		"https://i.postimg.cc/zfTtVHDg/vlcsnap-2025-03-03-13h03m10s915.png"
    }'::TEXT),
    ('Khoram Nezhad', 'Active', 84.4, '{
        "https://i.postimg.cc/FKRNjzWp/khoram.jpg",
		"https://i.postimg.cc/ZKDDghDC/vlcsnap-2025-03-03-13h03m13s049.png",
        "https://i.postimg.cc/CM72G8GC/vlcsnap-2025-03-03-13h03m15s147.png",
        "https://i.postimg.cc/D0xY7Vvp/vlcsnap-2025-03-03-13h03m17s171.png",
		"https://i.postimg.cc/sXpkd0Gb/vlcsnap-2025-03-03-13h03m19s701.png"
    }'::TEXT),
	('Istanbul Project', 'Inactive', 84.4, '{
		"https://i.postimg.cc/x8P4xyqz/istanbul.jpg",
		"https://i.postimg.cc/90CvWtG0/vlcsnap-2025-03-03-13h03m21s544.png",
        "https://i.postimg.cc/cJ8qTJxx/vlcsnap-2025-03-03-13h03m24s444.png",
        "https://i.postimg.cc/x1ZDKmSp/vlcsnap-2025-03-03-13h03m26s229.png",
		"https://i.postimg.cc/sgHyw85c/vlcsnap-2025-03-03-13h03m28s081.png"
	}'::TEXT);


-- ----------------------------------------------------------------------
-- CAMERAS
-- ----------------------------------------------------------------------

INSERT INTO cameras (name, site_id, type, online, connected, last_synced_time) VALUES
    ('DJI Matrice 300 RTK', 1, 'drone', TRUE, TRUE, '2025-03-01 16:15:00'),
    ('FLIR Quasar 4K IR PTZ', 1, 'camera', TRUE, FALSE, '2025-03-01 12:10:00'),
    ('Axis P1448-LE', 1, 'camera', FALSE, TRUE, '2025-03-01 08:05:00'),
    ('Anafi USA', 8, 'drone', TRUE, TRUE, '2025-03-01 10:00:00'),
    ('Autel Robotics EVO II Pro', 3, 'drone', FALSE, FALSE, '2025-02-28 18:00:00'),
    ('Skydio 2+', 6, 'camera', TRUE, TRUE, '2025-03-01 14:30:00'),
    ('Bosch FLEXIDOME IP starlight 8000i', 3, 'camera', TRUE, FALSE, '2025-03-01 11:45:00'),
    ('Hikvision DS-2CD2387G2-LU', 6, 'camera', FALSE, TRUE, '2025-03-01 09:20:00'),
    ('DJI Inspire 3', 9, 'drone', TRUE, TRUE, '2025-03-01 15:50:00'),
    ('Sony SNC-VM772R', 9, 'camera', TRUE, TRUE, '2025-03-01 13:15:00');



-- ----------------------------------------------------------------------
-- SESSIONS
-- ----------------------------------------------------------------------

INSERT INTO sessions (session_id, site_id, camera_id, mode, start_time, end_time, safety_score, progress) VALUES
    ('S0028', 1, 1, 'General', '2025-02-01 08:00:00', '2025-02-01 16:00:00', 82.5, '+2.3%'),
    ('S0029', 3, 2, 'Height', '2025-02-01 09:00:00', '2025-02-01 17:00:00', 78.2, NULL),
    ('S0030', 6, 3, 'Entry', '2025-02-01 10:00:00', '2025-02-01 18:00:00', 85.1, NULL),
    ('S0031', 8, 4, 'General', '2025-02-01 11:00:00', '2025-02-01 19:00:00', 68.0, NULL),
    ('S0032', 9, 5, 'Entry', '2025-02-01 12:00:00', '2025-02-01 20:00:00', 80.4, NULL),
    ('S0033', 1, 6, 'Entry', '2025-02-02 08:00:00', '2025-02-02 16:00:00', 87.8, NULL),
    ('S0034', 3, 7, 'Workshop', '2025-02-02 09:00:00', '2025-02-02 17:00:00', 89.3, NULL),
    ('S0035', 6, 8, 'General', '2025-02-02 10:00:00', '2025-02-02 18:00:00', 76.0, NULL),
    ('S0036', 8, 9, 'General', '2025-02-02 11:00:00', '2025-02-02 19:00:00', 84.4, NULL),
    ('S0037', 9, 10, 'Height', '2025-02-02 12:00:00', '2025-02-02 20:00:00', 83.4, NULL),
    ('S0038', 1, 1, 'General', '2025-02-03 08:00:00', '2025-02-03 16:00:00', 79.7, NULL),
    ('S0039', 3, 2, 'General', '2025-02-03 09:00:00', '2025-02-03 17:00:00', 83.3, NULL),
    ('S0040', 6, 3, 'Entry', '2025-02-03 10:00:00', '2025-02-03 18:00:00', 70.6, NULL),
    ('S0041', 8, 4, 'General', '2025-02-03 11:00:00', '2025-02-03 19:00:00', 85.2, NULL),
    ('S0042', 9, 5, 'General', '2025-02-03 12:00:00', '2025-02-03 20:00:00', 81.2, NULL),
    ('S0043', 1, 6, 'General', '2025-02-04 08:00:00', '2025-02-04 16:00:00', 86.2, NULL),
    ('S0044', 3, 7, 'General', '2025-02-04 09:00:00', '2025-02-04 17:00:00', 79.1, NULL),
    ('S0045', 6, 8, 'General', '2025-02-04 10:00:00', '2025-02-04 18:00:00', 84.8, NULL),
    ('S0046', 8, 9, 'Height', '2025-02-04 11:00:00', '2025-02-04 19:00:00', 84.4, NULL),
    ('S0047', 9, 10, 'General', '2025-02-04 12:00:00', '2025-02-04 20:00:00', 80.7, NULL),
    ('S0048', 1, 1, 'General', '2025-02-05 08:00:00', '2025-02-05 16:00:00', 81.7, NULL),
    ('S0049', 3, 2, 'Entry', '2025-02-05 09:00:00', '2025-02-05 17:00:00', 68.6, NULL),
    ('S0050', 6, 3, 'General', '2025-02-05 10:00:00', '2025-02-05 18:00:00', 83.2, NULL),
    ('S0051', 8, 4, 'General', '2025-02-05 11:00:00', '2025-02-05 19:00:00', 79.2, NULL),
    ('S0052', 9, 5, 'Workshop', '2025-02-05 12:00:00', '2025-02-05 20:00:00', 88.2, NULL),
    ('S0053', 1, 6, 'General', '2025-02-06 08:00:00', '2025-02-06 16:00:00', 76.2, NULL),
    ('S0054', 3, 7, 'General', '2025-02-06 09:00:00', '2025-02-06 17:00:00', 84.1, NULL),
    ('S0055', 6, 8, 'Height', '2025-02-06 10:00:00', '2025-02-06 18:00:00', 83.4, NULL),
    ('S0056', 8, 9, 'General', '2025-02-06 11:00:00', '2025-02-06 19:00:00', 78.7, NULL),
    ('S0057', 9, 10, 'General', '2025-02-06 12:00:00', '2025-02-06 20:00:00', 80.3, NULL),
    ('S0058', 1, 1, 'Entry', '2025-02-07 08:00:00', '2025-02-07 16:00:00', 75.6, NULL),
    ('S0059', 3, 2, 'General', '2025-02-07 09:00:00', '2025-02-07 17:00:00', 81.2, NULL),
    ('S0060', 6, 3, 'General', '2025-02-07 10:00:00', '2025-02-07 18:00:00', 86.2, NULL),
    ('S0061', 8, 4, 'Workshop', '2025-02-07 11:00:00', '2025-02-07 19:00:00', 88.3, NULL),
    ('S0062', 9, 5, 'General', '2025-02-07 12:00:00', '2025-02-07 20:00:00', 80.2, NULL),
    ('S0063', 1, 6, 'General', '2025-02-08 08:00:00', '2025-02-08 16:00:00', 83.2, NULL),
    ('S0064', 3, 7, 'Height', '2025-02-08 09:00:00', '2025-02-08 17:00:00', 80.4, NULL),
    ('S0065', 6, 8, 'General', '2025-02-08 10:00:00', '2025-02-08 18:00:00', 78.7, NULL),
    ('S0066', 8, 9, 'General', '2025-02-08 11:00:00', '2025-02-08 19:00:00', 84.3, NULL),
    ('S0067', 9, 10, 'Entry', '2025-02-08 12:00:00', '2025-02-08 20:00:00', 74.6, NULL),
    ('S0068', 1, 1, 'General', '2025-02-09 08:00:00', '2025-02-09 16:00:00', 80.2, NULL),
    ('S0069', 3, 2, 'General', '2025-02-09 09:00:00', '2025-02-09 17:00:00', 85.2, NULL),
    ('S0070', 6, 3, 'Workshop', '2025-02-09 10:00:00', '2025-02-09 18:00:00', 87.2, NULL),
    ('S0071', 8, 4, 'General', '2025-02-09 11:00:00', '2025-02-09 19:00:00', 78.2, NULL),
    ('S0072', 9, 5, 'General', '2025-02-09 12:00:00', '2025-02-09 20:00:00', 81.2, NULL),
    ('S0073', 1, 6, 'Height', '2025-02-10 08:00:00', '2025-02-10 16:00:00', 84.4, NULL),
    ('S0074', 3, 7, 'General', '2025-02-10 09:00:00', '2025-02-10 17:00:00', 79.7, NULL),
    ('S0075', 6, 8, 'General', '2025-02-10 10:00:00', '2025-02-10 18:00:00', 80.3, NULL),
    ('S0076', 8, 9, 'Entry', '2025-02-10 11:00:00', '2025-02-10 19:00:00', 76.6, NULL),
    ('S0077', 9, 10, 'General', '2025-02-10 12:00:00', '2025-02-10 20:00:00', 82.2, NULL);


-- ----------------------------------------------------------------------
-- SNAPSHOTS
-- ----------------------------------------------------------------------

-- Session S0028 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0028', 'https://i.postimg.cc/vHVgQHgQ/Screenshot-2025-03-02-at-2-21-12-PM.png', '2025-02-01 09:00:00'),
    ('S0028', 'https://i.postimg.cc/JtCrmsf1/Screenshot-2025-03-03-at-12-26-20-pm.png', '2025-02-01 11:00:00'),
    ('S0028', 'https://i.postimg.cc/Njt1SrJh/Screenshot-2025-03-02-at-2-21-39-PM.png', '2025-02-01 13:00:00'),
    ('S0028', 'https://i.postimg.cc/DwFGP0Sk/Screenshot-2025-03-03-at-12-25-38-pm.png', '2025-02-01 15:00:00');

-- Session S0029 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0029', 'https://i.postimg.cc/YCN5gVD5/Screenshot-2025-03-02-at-1-39-06-PM.png', '2025-02-01 10:00:00'),
    ('S0029', 'https://i.postimg.cc/447pJjDM/Screenshot-2025-03-03-at-12-24-58-pm.png', '2025-02-01 12:00:00'),
    ('S0029', 'https://i.postimg.cc/kMFhy64q/Screenshot-2025-03-03-at-12-18-24-pm.png', '2025-02-01 14:00:00'),
    ('S0029', 'https://i.postimg.cc/25tN8WKy/Screenshot-2025-03-02-at-2-15-31-PM.png', '2025-02-01 16:00:00');

-- Session S0030 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0030', 'https://i.postimg.cc/QCLB7RvL/Screenshot-2025-03-02-at-3-18-43-PM.png', '2025-02-01 11:00:00'),
    ('S0030', 'https://i.postimg.cc/mD9kTmkm/Screenshot-2025-03-02-at-3-23-24-PM.png', '2025-02-01 13:00:00'),
    ('S0030', 'https://i.postimg.cc/zGDyTw2f/Screenshot-2025-03-02-at-3-28-35-PM.png', '2025-02-01 15:00:00'),
    ('S0030', 'https://i.postimg.cc/zGdV7L4F/Screenshot-2025-03-02-at-3-30-20-PM.png', '2025-02-01 17:00:00');

-- Session S0031 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0031', 'https://i.postimg.cc/mkHL0Y6X/Screenshot-2025-03-03-at-12-24-35-pm.png', '2025-02-01 12:00:00'),
    ('S0031', 'https://i.postimg.cc/CMqfykDp/Screenshot-2025-03-03-at-12-27-00-pm.png', '2025-02-01 14:00:00'),
    ('S0031', 'https://i.postimg.cc/YSnYvDpk/Screenshot-2025-03-02-at-2-35-11-PM.png', '2025-02-01 16:00:00'),
    ('S0031', 'https://i.postimg.cc/4djc5K7S/Screenshot-2025-03-02-at-2-35-36-PM.png', '2025-02-01 18:00:00');

-- Session S0032 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0032', 'https://i.postimg.cc/rwW4SWV9/Screenshot-2025-03-03-at-12-21-20-pm.png', '2025-02-01 13:00:00'),
    ('S0032', 'https://i.postimg.cc/YqM0wfHx/Screenshot-2025-03-02-at-4-08-53-PM.png', '2025-02-01 15:00:00'),
    ('S0032', 'https://i.postimg.cc/Dzvz8b80/Screenshot-2025-03-03-at-12-23-15-pm.png', '2025-02-01 17:00:00'),
    ('S0032', 'https://i.postimg.cc/d05VdtyB/Screenshot-2025-03-03-at-12-24-01-pm.png', '2025-02-01 19:00:00');

-- Session S0033 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0033', 'https://i.postimg.cc/C1ZnxfQD/Screenshot-2025-03-03-at-12-25-13-pm.png', '2025-02-02 09:00:00'),
    ('S0033', 'https://i.postimg.cc/44YfqXW9/vlcsnap-2025-03-03-13h05m04s538.png', '2025-02-02 11:00:00'),
    ('S0033', 'https://i.postimg.cc/85nYLQW8/vlcsnap-2025-03-03-13h05m06s199.png', '2025-02-02 13:00:00'),
    ('S0033', 'https://i.postimg.cc/nryww400/vlcsnap-2025-03-03-13h05m08s039.png', '2025-02-02 15:00:00');

-- Session S0034 -- Workshop
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0034', 'https://i.postimg.cc/wMW9LBqb/Screenshot-2025-03-02-at-2-18-42-PM.png', '2025-02-02 10:00:00'),
    ('S0034', 'https://i.postimg.cc/Yqc5DgVf/Screenshot-2025-03-02-at-2-30-45-PM.png', '2025-02-02 12:00:00'),
    ('S0034', 'https://i.postimg.cc/HxwwpqYL/Screenshot-2025-03-02-at-2-32-09-PM.png', '2025-02-02 14:00:00'),
    ('S0034', 'https://i.postimg.cc/RFZSFf9n/Screenshot-2025-03-02-at-2-32-37-PM.png', '2025-02-02 16:00:00');

-- Session S0035 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0035', 'https://i.postimg.cc/hjhP0W8q/Screenshot-2025-03-03-at-12-24-23-pm.png', '2025-02-02 11:00:00'),
    ('S0035', 'https://i.postimg.cc/NM295gJ7/Screenshot-2025-03-02-at-2-39-58-PM.png', '2025-02-02 13:00:00'),
    ('S0035', 'https://i.postimg.cc/FzjYVTQY/Screenshot-2025-03-02-at-2-53-16-PM.png', '2025-02-02 15:00:00'),
    ('S0035', 'https://i.postimg.cc/1Xwgp1P3/Screenshot-2025-03-03-at-12-26-34-pm.png', '2025-02-02 17:00:00');

-- Session S0036 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0036', 'https://i.postimg.cc/QCwB7NvP/Screenshot-2025-03-03-at-12-21-45-pm.png', '2025-02-02 12:00:00'),
    ('S0036', 'https://i.postimg.cc/tgxVtF8B/Screenshot-2025-03-03-at-11-42-43-AM.png ', '2025-02-02 14:00:00'),
    ('S0036', 'https://i.postimg.cc/Y9QYkQ3v/Screenshot-2025-03-03-at-11-43-19-AM.png', '2025-02-02 16:00:00'),
    ('S0036', 'https://i.postimg.cc/8znhbpcz/Screenshot-2025-03-03-at-11-43-35-AM.png', '2025-02-02 18:00:00');

-- Session S0037 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0037', 'https://i.postimg.cc/Y2fDdgzF/Screenshot-2025-03-02-at-2-16-36-PM.png', '2025-02-02 13:00:00'),
    ('S0037', 'https://i.postimg.cc/J403jB6M/Screenshot-2025-03-02-at-2-44-54-PM.png', '2025-02-02 15:00:00'),
    ('S0037', 'https://i.postimg.cc/bwT2MyF3/Screenshot-2025-03-02-at-2-45-53-PM.png', '2025-02-02 17:00:00'),
    ('S0037', 'https://i.postimg.cc/G2J0Pfp8/Screenshot-2025-03-02-at-3-09-40-PM.png', '2025-02-02 19:00:00');

-- Session S0038 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0038', 'https://i.postimg.cc/pLdf8h2S/Screenshot-2025-03-03-at-11-44-20-AM.png', '2025-02-03 09:00:00'),
    ('S0038', 'https://i.postimg.cc/NG1kwvJd/Screenshot-2025-03-03-at-11-44-38-AM.png', '2025-02-03 11:00:00'),
    ('S0038', 'https://i.postimg.cc/d0x4DRrn/vlcsnap-2025-03-03-11h59m36s607.png', '2025-02-03 13:00:00'),
    ('S0038', 'https://i.postimg.cc/L8vyFFsc/vlcsnap-2025-03-03-11h59m44s470.png', '2025-02-03 15:00:00');

-- Session S0039 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0039', 'https://i.postimg.cc/y87fG87h/vlcsnap-2025-03-03-11h59m50s704.png', '2025-02-03 10:00:00'),
    ('S0039', 'https://i.postimg.cc/MK23yY4F/vlcsnap-2025-03-03-11h59m55s096.png', '2025-02-03 12:00:00'),
    ('S0039', 'https://i.postimg.cc/RZTYCngb/vlcsnap-2025-03-03-11h59m58s496.png', '2025-02-03 14:00:00'),
    ('S0039', 'https://i.postimg.cc/jST9rh47/vlcsnap-2025-03-03-12h00m01s630.png', '2025-02-03 16:00:00');

-- Session S0040 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0040', 'https://i.postimg.cc/wMyGVfc1/vlcsnap-2025-03-03-13h05m09s862.png', '2025-02-03 11:00:00'),
    ('S0040', 'https://i.postimg.cc/6qyDP5w5/vlcsnap-2025-03-03-13h05m11s796.png', '2025-02-03 13:00:00'),
    ('S0040', 'https://i.postimg.cc/5tmdYRn1/vlcsnap-2025-03-03-13h05m13s595.png', '2025-02-03 15:00:00'),
    ('S0040', 'https://i.postimg.cc/J49W9Jsw/vlcsnap-2025-03-03-13h05m15s359.png', '2025-02-03 17:00:00');

-- Session S0041 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0041', 'https://i.postimg.cc/66DgMK7z/vlcsnap-2025-03-03-12h00m04s505.png', '2025-02-03 12:00:00'),
    ('S0041', 'https://i.postimg.cc/qgVsyjvX/vlcsnap-2025-03-03-12h00m08s221.png', '2025-02-03 14:00:00'),
    ('S0041', 'https://i.postimg.cc/8cF4h7BD/vlcsnap-2025-03-03-12h00m11s462.png', '2025-02-03 16:00:00'),
    ('S0041', 'https://i.postimg.cc/TwNQLVbC/vlcsnap-2025-03-03-12h00m14s340.png', '2025-02-03 18:00:00');

-- Session S0042 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUEShttps://i.postimg.cc/zXV6jBXy/vlcsnap-2025-03-03-12h00m33s599.png
    ('S0042', 'https://i.postimg.cc/HL26HDkG/vlcsnap-2025-03-03-12h00m18s084.png', '2025-02-03 13:00:00'),
    ('S0042', 'https://i.postimg.cc/rw5hnt6w/vlcsnap-2025-03-03-12h00m21s269.png', '2025-02-03 15:00:00'),
    ('S0042', 'https://i.postimg.cc/zXV6jBXy/vlcsnap-2025-03-03-12h00m33s599.png', '2025-02-03 17:00:00'),
    ('S0042', 'https://i.postimg.cc/FznqvtGF/vlcsnap-2025-03-03-12h00m36s793.png', '2025-02-03 19:00:00');

-- Session S0043 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0043', 'https://i.postimg.cc/PxT0zQPH/vlcsnap-2025-03-03-12h00m39s702.png', '2025-02-04 09:00:00'),
    ('S0043', 'https://i.postimg.cc/DzV9mTh8/vlcsnap-2025-03-03-12h00m44s138.png', '2025-02-04 11:00:00'),
    ('S0043', 'https://i.postimg.cc/6q5JwfXc/vlcsnap-2025-03-03-12h00m50s145.png', '2025-02-04 13:00:00'),
    ('S0043', 'https://i.postimg.cc/bJPfVjVK/vlcsnap-2025-03-03-12h00m53s348.png', '2025-02-04 15:00:00');

-- Session S0044 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0044', 'https://i.postimg.cc/Vk38Mtqs/vlcsnap-2025-03-03-12h00m57s020.png', '2025-02-04 10:00:00'),
    ('S0044', 'https://i.postimg.cc/v8zbjcsX/vlcsnap-2025-03-03-12h15m45s548.png', '2025-02-04 12:00:00'),
    ('S0044', 'https://i.postimg.cc/nrkFGLHR/vlcsnap-2025-03-03-12h15m49s541.png', '2025-02-04 14:00:00'),
    ('S0044', 'https://i.postimg.cc/G2vh9Q61/vlcsnap-2025-03-03-12h15m52s918.png', '2025-02-04 16:00:00');

-- Session S0045 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0045', 'https://i.postimg.cc/Jhfz1g6q/vlcsnap-2025-03-03-12h15m55s901.png', '2025-02-04 11:00:00'),
    ('S0045', 'https://i.postimg.cc/nhwLWMqN/vlcsnap-2025-03-03-12h15m58s814.png', '2025-02-04 13:00:00'),
    ('S0045', 'https://i.postimg.cc/kGF4Ycyy/vlcsnap-2025-03-03-12h16m02s025.png', '2025-02-04 15:00:00'),
    ('S0045', 'https://i.postimg.cc/fyhyvFYL/vlcsnap-2025-03-03-12h18m09s205.png', '2025-02-04 17:00:00');

-- Session S0046 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0046', 'https://i.postimg.cc/tCRZL18w/Screenshot-2025-03-02-at-3-04-23-PM.png', '2025-02-04 12:00:00'),
    ('S0046', 'https://i.postimg.cc/026xMPSr/Screenshot-2025-03-02-at-3-15-58-PM.png', '2025-02-04 14:00:00'),
    ('S0046', 'https://i.postimg.cc/PxmyFL0N/Screenshot-2025-03-02-at-3-19-11-PM.png', '2025-02-04 16:00:00'),
    ('S0046', 'https://i.postimg.cc/ZKw71GpQ/Screenshot-2025-03-03-at-12-19-07-pm.png', '2025-02-04 18:00:00');

-- Session S0047 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0047', 'https://i.postimg.cc/bvWsZdJ1/vlcsnap-2025-03-03-12h18m15s934.png', '2025-02-04 13:00:00'),
    ('S0047', 'https://i.postimg.cc/SKJnQcyy/vlcsnap-2025-03-03-12h18m19s111.png', '2025-02-04 15:00:00'),
    ('S0047', 'https://i.postimg.cc/xd4bLtsJ/vlcsnap-2025-03-03-12h18m53s784.png', '2025-02-04 17:00:00'),
    ('S0047', 'https://i.postimg.cc/JzRJ8yDn/vlcsnap-2025-03-03-12h18m59s154.png', '2025-02-04 19:00:00');

-- Session S0048 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0048', 'https://i.postimg.cc/Yq6gTNSZ/vlcsnap-2025-03-03-12h19m01s939.png', '2025-02-05 09:00:00'),
    ('S0048', 'https://i.postimg.cc/kX3KjY7W/vlcsnap-2025-03-03-12h19m04s619.png', '2025-02-05 11:00:00'),
    ('S0048', 'https://i.postimg.cc/4djVRBVk/vlcsnap-2025-03-03-12h19m16s115.png', '2025-02-05 13:00:00'),
    ('S0048', 'https://i.postimg.cc/FKsjyfNq/vlcsnap-2025-03-03-12h19m24s801.png', '2025-02-05 15:00:00');

-- Session S0049 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0049', 'https://i.postimg.cc/8PFSKwPB/vlcsnap-2025-03-03-13h05m17s060.png', '2025-02-05 10:00:00'),
    ('S0049', 'https://i.postimg.cc/bv080JY7/vlcsnap-2025-03-03-13h05m18s867.png', '2025-02-05 12:00:00'),
    ('S0049', 'https://i.postimg.cc/pdMRn8vQ/vlcsnap-2025-03-03-13h05m20s816.png', '2025-02-05 14:00:00'),
    ('S0049', 'https://i.postimg.cc/c4js025b/vlcsnap-2025-03-03-13h05m22s517.png', '2025-02-05 16:00:00');

-- Session S0050 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0050', 'https://i.postimg.cc/bwP0vCMq/vlcsnap-2025-03-03-12h19m28s025.png', '2025-02-05 11:00:00'),
    ('S0050', 'https://i.postimg.cc/xjWywT3J/vlcsnap-2025-03-03-12h19m31s452.png', '2025-02-05 13:00:00'),
    ('S0050', 'https://i.postimg.cc/zBvVBK8z/vlcsnap-2025-03-03-12h19m34s390.png', '2025-02-05 15:00:00'),
    ('S0050', 'https://i.postimg.cc/vmQ4JCK6/vlcsnap-2025-03-03-12h19m37s019.png', '2025-02-05 17:00:00');

-- Session S0051 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0051', 'https://i.postimg.cc/Bb8LhDVY/vlcsnap-2025-03-03-12h19m40s258.png', '2025-02-05 12:00:00'),
    ('S0051', 'https://i.postimg.cc/9fp7zc9p/vlcsnap-2025-03-03-12h19m44s117.png', '2025-02-05 14:00:00'),
    ('S0051', 'https://i.postimg.cc/q70KkNNq/vlcsnap-2025-03-03-12h19m46s777.png', '2025-02-05 16:00:00'),
    ('S0051', 'https://i.postimg.cc/mg7MfY2K/vlcsnap-2025-03-03-12h19m49s360.png', '2025-02-05 18:00:00');

-- Session S0052 -- Workshop
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0052', 'https://i.postimg.cc/N05Yvtx1/Screenshot-2025-03-02-at-2-32-56-PM.png', '2025-02-05 13:00:00'),
    ('S0052', 'https://i.postimg.cc/pXrYnp50/Screenshot-2025-03-03-at-12-20-37-pm.png', '2025-02-05 15:00:00'),
    ('S0052', 'https://i.postimg.cc/cJN7V1Wz/Screenshot-2025-03-02-at-2-41-51-PM.png', '2025-02-05 17:00:00'),
    ('S0052', 'https://i.postimg.cc/HxnrNFrK/Screenshot-2025-03-02-at-2-42-31-PM.png', '2025-02-05 19:00:00');

-- Session S0053 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0053', 'https://i.postimg.cc/rmfxZqFm/vlcsnap-2025-03-03-12h19m52s164.png', '2025-02-06 09:00:00'),
    ('S0053', 'https://i.postimg.cc/BvcxDxr2/vlcsnap-2025-03-03-12h19m55s372.png', '2025-02-06 11:00:00'),
    ('S0053', 'https://i.postimg.cc/GhVJ13PT/vlcsnap-2025-03-03-12h19m58s354.png', '2025-02-06 13:00:00'),
    ('S0053', 'https://i.postimg.cc/hPfbwQmq/vlcsnap-2025-03-03-12h20m01s267.png', '2025-02-06 15:00:00');

-- Session S0054 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0054', 'https://i.postimg.cc/kG5F7BhK/vlcsnap-2025-03-03-12h20m03s886.png', '2025-02-06 10:00:00'),
    ('S0054', 'https://i.postimg.cc/SK0rcQJb/vlcsnap-2025-03-03-12h20m06s344.png', '2025-02-06 12:00:00'),
    ('S0054', 'https://i.postimg.cc/jqvZBrky/vlcsnap-2025-03-03-12h20m09s824.png', '2025-02-06 14:00:00'),
    ('S0054', 'https://i.postimg.cc/x8s5mKb6/vlcsnap-2025-03-03-12h20m12s754.png', '2025-02-06 16:00:00');

-- Session S0055 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0055', 'https://i.postimg.cc/SKKjvH59/Screenshot-2025-03-02-at-3-26-18-PM.png', '2025-02-06 11:00:00'),
    ('S0055', 'https://i.postimg.cc/Fzx4mHkH/Screenshot-2025-03-02-at-3-27-09-PM.png', '2025-02-06 13:00:00'),
    ('S0055', 'https://i.postimg.cc/sg16yTJg/Screenshot-2025-03-03-at-12-19-42-pm.png', '2025-02-06 15:00:00'),
    ('S0055', 'https://i.postimg.cc/9FHwc0tR/Screenshot-2025-03-03-at-12-27-12-pm.png', '2025-02-06 17:00:00');

-- Session S0056 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0056', 'https://i.postimg.cc/3RFn8Mr5/vlcsnap-2025-03-03-12h20m15s328.png', '2025-02-06 12:00:00'),
    ('S0056', 'https://i.postimg.cc/sDD022Zn/vlcsnap-2025-03-03-12h20m19s982.png', '2025-02-06 14:00:00'),
    ('S0056', 'https://i.postimg.cc/NFbJx3Z7/vlcsnap-2025-03-03-12h20m23s154.png', '2025-02-06 16:00:00'),
    ('S0056', 'https://i.postimg.cc/XJfDrG8P/vlcsnap-2025-03-03-12h20m25s706.png', '2025-02-06 18:00:00');

-- Session S0057 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0057', 'https://i.postimg.cc/5tFrMkFb/vlcsnap-2025-03-03-12h20m28s407.png', '2025-02-06 13:00:00'),
    ('S0057', 'https://i.postimg.cc/tCX8V58N/vlcsnap-2025-03-03-12h20m31s539.png', '2025-02-06 15:00:00'),
    ('S0057', 'https://i.postimg.cc/3NhV1CN7/vlcsnap-2025-03-03-12h20m36s807.png', '2025-02-06 17:00:00'),
    ('S0057', 'https://i.postimg.cc/8CqqJVV7/vlcsnap-2025-03-03-12h20m39s433.png', '2025-02-06 19:00:00');

-- Session S0058 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0058', 'https://i.postimg.cc/WbtNRTSZ/vlcsnap-2025-03-03-13h05m24s261.png', '2025-02-07 09:00:00'),
    ('S0058', 'https://i.postimg.cc/rw0w4MrT/vlcsnap-2025-03-03-13h05m26s098.png', '2025-02-07 11:00:00'),
    ('S0058', 'https://i.postimg.cc/kXh5DBDw/vlcsnap-2025-03-03-13h05m28s249.png', '2025-02-07 13:00:00'),
    ('S0058', 'https://i.postimg.cc/j5Q5jcJJ/vlcsnap-2025-03-03-13h05m30s307.png', '2025-02-07 15:00:00');

-- Session S0059 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0059', 'https://i.postimg.cc/jqzrfC2t/vlcsnap-2025-03-03-12h20m42s751.png', '2025-02-07 10:00:00'),
    ('S0059', 'https://i.postimg.cc/sxRd8Cnk/vlcsnap-2025-03-03-12h20m45s308.png', '2025-02-07 12:00:00'),
    ('S0059', 'https://i.postimg.cc/W4hvqnFH/vlcsnap-2025-03-03-12h20m49s171.png', '2025-02-07 14:00:00'),
    ('S0059', 'https://i.postimg.cc/fTfZGkQB/vlcsnap-2025-03-03-12h20m52s637.png', '2025-02-07 16:00:00');

-- Session S0060 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0060', 'https://i.postimg.cc/0QKPFf9w/vlcsnap-2025-03-03-12h20m56s551.png', '2025-02-07 11:00:00'),
    ('S0060', 'https://i.postimg.cc/CK1FH0tJ/vlcsnap-2025-03-03-12h20m59s192.png', '2025-02-07 13:00:00'),
    ('S0060', 'https://i.postimg.cc/vHFZRpgH/vlcsnap-2025-03-03-12h21m05s341.png', '2025-02-07 15:00:00'),
    ('S0060', 'https://i.postimg.cc/FKsKW3fy/vlcsnap-2025-03-03-12h21m12s221.png', '2025-02-07 17:00:00');

-- Session S0061 -- Workshop
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0061', 'https://i.postimg.cc/jdf29bpx/Screenshot-2025-03-03-at-12-23-38-pm.png', '2025-02-07 12:00:00'),
    ('S0061', 'https://i.postimg.cc/zv07Yhbh/Screenshot-2025-03-03-at-12-20-27-pm.png', '2025-02-07 14:00:00'),
    ('S0061', 'https://i.postimg.cc/zvXYp13b/Screenshot-2025-03-02-at-2-20-09-PM.png', '2025-02-07 16:00:00'),
    ('S0061', 'https://i.postimg.cc/5tTmn50w/Screenshot-2025-03-02-at-2-31-23-PM.png', '2025-02-07 18:00:00');

-- Session S0062 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0062', 'https://i.postimg.cc/Dft8vSDh/vlcsnap-2025-03-03-12h21m14s961.png', '2025-02-07 13:00:00'),
    ('S0062', 'https://i.postimg.cc/QNBFZQfS/vlcsnap-2025-03-03-12h21m18s612.png', '2025-02-07 15:00:00'),
    ('S0062', 'https://i.postimg.cc/k4HPyt8g/vlcsnap-2025-03-03-12h21m23s935.png', '2025-02-07 17:00:00'),
    ('S0062', 'https://i.postimg.cc/zGY5MWQL/vlcsnap-2025-03-03-12h21m27s468.png', '2025-02-07 19:00:00');

-- Session S0063 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0063', 'https://i.postimg.cc/tRf938tN/vlcsnap-2025-03-03-12h21m31s041.png', '2025-02-08 09:00:00'),
    ('S0063', 'https://i.postimg.cc/sxty3ZDN/vlcsnap-2025-03-03-12h21m33s887.png', '2025-02-08 11:00:00'),
    ('S0063', 'https://i.postimg.cc/Kcs891FL/vlcsnap-2025-03-03-12h21m42s866.png', '2025-02-08 13:00:00'),
    ('S0063', 'https://i.postimg.cc/PJcfNRKK/vlcsnap-2025-03-03-12h21m45s507.png', '2025-02-08 15:00:00');

-- Session S0064 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0064', 'https://i.postimg.cc/MpTNRzKt/vlcsnap-2025-03-03-11h52m11s306.png', '2025-02-08 10:00:00'),
    ('S0064', 'https://i.postimg.cc/029LkpTT/vlcsnap-2025-03-03-11h52m21s545.png', '2025-02-08 12:00:00'),
    ('S0064', 'https://i.postimg.cc/gjW16Rn6/vlcsnap-2025-03-03-11h52m26s274.png', '2025-02-08 14:00:00'),
    ('S0064', 'https://i.postimg.cc/fbFNkJcx/vlcsnap-2025-03-03-11h52m36s154.png', '2025-02-08 16:00:00');

-- Session S0065 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0065', 'https://i.postimg.cc/d1sVfdLR/vlcsnap-2025-03-03-12h21m48s055.png', '2025-02-08 11:00:00'),
    ('S0065', 'https://i.postimg.cc/xTccYKgt/vlcsnap-2025-03-03-12h21m50s889.png', '2025-02-08 13:00:00'),
    ('S0065', 'https://i.postimg.cc/GtStG23F/vlcsnap-2025-03-03-12h21m56s634.png', '2025-02-08 15:00:00'),
    ('S0065', 'https://i.postimg.cc/GtStG23F/vlcsnap-2025-03-03-12h21m56s634.png', '2025-02-08 17:00:00');

-- Session S0066 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0066', 'https://i.postimg.cc/3NL4111D/vlcsnap-2025-03-03-12h22m02s312.png', '2025-02-08 12:00:00'),
    ('S0066', 'https://i.postimg.cc/MHZf1N7S/vlcsnap-2025-03-03-12h22m04s824.png', '2025-02-08 14:00:00'),
    ('S0066', 'https://i.postimg.cc/qRxCh4Cw/vlcsnap-2025-03-03-12h22m08s888.png', '2025-02-08 16:00:00'),
    ('S0066', 'https://i.postimg.cc/Y9HWChjj/vlcsnap-2025-03-03-12h22m11s857.png', '2025-02-08 18:00:00');

-- Session S0067 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0067', 'https://i.postimg.cc/1zFXksmB/vlcsnap-2025-03-03-13h05m32s035.png', '2025-02-08 13:00:00'),
    ('S0067', 'https://i.postimg.cc/9FX4r6bX/vlcsnap-2025-03-03-13h05m34s063.png', '2025-02-08 15:00:00'),
    ('S0067', 'https://i.postimg.cc/XNkGNjwD/vlcsnap-2025-03-03-13h05m35s874.png', '2025-02-08 17:00:00'),
    ('S0067', 'https://i.postimg.cc/QChFgwrb/vlcsnap-2025-03-03-13h05m37s670.png', '2025-02-08 19:00:00');

-- Session S0068 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0068', 'https://i.postimg.cc/sx37wvRb/vlcsnap-2025-03-03-12h22m21s050.png', '2025-02-09 09:00:00'),
    ('S0068', 'https://i.postimg.cc/MHZf1N7S/vlcsnap-2025-03-03-12h22m04s824.png', '2025-02-09 11:00:00'),
    ('S0068', 'https://i.postimg.cc/qRxCh4Cw/vlcsnap-2025-03-03-12h22m08s888.png', '2025-02-09 13:00:00'),
    ('S0068', 'https://i.postimg.cc/Y9HWChjj/vlcsnap-2025-03-03-12h22m11s857.png', '2025-02-09 15:00:00');

-- Session S0069 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0069', 'https://i.postimg.cc/sx37wvRb/vlcsnap-2025-03-03-12h22m21s050.png', '2025-02-09 10:00:00'),
    ('S0069', 'https://i.postimg.cc/mrFYrvwp/vlcsnap-2025-03-03-12h23m39s995.png', '2025-02-09 12:00:00'),
    ('S0069', 'https://i.postimg.cc/pLSQRWDn/vlcsnap-2025-03-03-12h23m42s912.png', '2025-02-09 14:00:00'),
    ('S0069', 'https://i.postimg.cc/y6hTczzw/vlcsnap-2025-03-03-12h23m46s339.png', '2025-02-09 16:00:00');

-- Session S0070 --Workshop
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0070', 'https://i.postimg.cc/FHs54vxT/Screenshot-2025-03-02-at-2-19-10-PM.png', '2025-02-09 11:00:00'),
    ('S0070', 'https://i.postimg.cc/vBG58Bdt/Screenshot-2025-03-03-at-12-20-59-pm.png', '2025-02-09 13:00:00'),
    ('S0070', 'https://i.postimg.cc/QMZK3YB3/vlcsnap-2025-03-03-12h00m25s399.png', '2025-02-09 15:00:00'),
    ('S0070', 'https://i.postimg.cc/DwX4R3w6/vlcsnap-2025-03-03-12h00m29s242.png', '2025-02-09 17:00:00');

-- Session S0071 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0071', 'https://i.postimg.cc/T33QTNFB/vlcsnap-2025-03-03-12h23m49s277.png', '2025-02-09 12:00:00'),
    ('S0071', 'https://i.postimg.cc/Wp058k0Y/vlcsnap-2025-03-03-12h23m52s620.png', '2025-02-09 14:00:00'),
    ('S0071', 'https://i.postimg.cc/Ghrq5mQL/vlcsnap-2025-03-03-12h23m55s710.png', '2025-02-09 16:00:00'),
    ('S0071', 'https://i.postimg.cc/d3RnVbqc/vlcsnap-2025-03-03-12h23m58s444.png', '2025-02-09 18:00:00');

-- Session S0072 - General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0072', 'https://i.postimg.cc/kMSpHZPc/vlcsnap-2025-03-03-12h24m01s999.png', '2025-02-09 13:00:00'),
    ('S0072', 'https://i.postimg.cc/hG3YFRGC/vlcsnap-2025-03-03-12h24m05s198.png', '2025-02-09 15:00:00'),
    ('S0072', 'https://i.postimg.cc/yNNGr87g/vlcsnap-2025-03-03-12h24m09s044.png', '2025-02-09 17:00:00'),
    ('S0072', 'https://i.postimg.cc/Bn4kHCyC/vlcsnap-2025-03-03-12h24m12s113.png', '2025-02-09 19:00:00');

-- Session S0073 -- Height
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0073', 'https://i.postimg.cc/L8xRKyhQ/vlcsnap-2025-03-03-11h52m43s475.png', '2025-02-10 09:00:00'),
    ('S0073', 'https://i.postimg.cc/FsQhjd2p/vlcsnap-2025-03-03-11h52m47s780.png', '2025-02-10 11:00:00'),
    ('S0073', 'https://i.postimg.cc/QCcs2hWc/vlcsnap-2025-03-03-11h52m51s276.png', '2025-02-10 13:00:00'),
    ('S0073', 'https://i.postimg.cc/Kc3Y7y4G/vlcsnap-2025-03-03-11h52m55s131.png', '2025-02-10 15:00:00');

-- Session S0074 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0074', 'https://i.postimg.cc/s2DFdJ42/vlcsnap-2025-03-03-12h24m15s335.png', '2025-02-10 10:00:00'),
    ('S0074', 'https://i.postimg.cc/jST0vTWP/vlcsnap-2025-03-03-12h24m18s594.png', '2025-02-10 12:00:00'),
    ('S0074', 'https://i.postimg.cc/15w1pXzy/vlcsnap-2025-03-03-12h24m21s996.png', '2025-02-10 14:00:00'),
    ('S0074', 'https://i.postimg.cc/d115nHm8/vlcsnap-2025-03-03-12h24m24s943.png', '2025-02-10 16:00:00');

-- Session S0075 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0075', 'https://i.postimg.cc/43XLHNY2/vlcsnap-2025-03-03-12h24m28s246.png', '2025-02-10 11:00:00'),
    ('S0075', 'https://i.postimg.cc/XqrDNHrV/vlcsnap-2025-03-03-12h24m31s003.png', '2025-02-10 13:00:00'),
    ('S0075', 'https://i.postimg.cc/90sgDd9y/vlcsnap-2025-03-03-12h24m33s984.png', '2025-02-10 15:00:00'),
    ('S0075', 'https://i.postimg.cc/rwx3tPQs/vlcsnap-2025-03-03-12h24m37s481.png', '2025-02-10 17:00:00');

-- Session S0076 -- Entry
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0076', 'https://i.postimg.cc/nL99nqkv/vlcsnap-2025-03-03-13h05m39s593.png', '2025-02-10 12:00:00'),
    ('S0076', 'https://i.postimg.cc/rwmtYBRZ/vlcsnap-2025-03-03-13h05m42s237.png', '2025-02-10 14:00:00'),
    ('S0076', 'https://i.postimg.cc/x82zxqLL/vlcsnap-2025-03-03-13h05m44s388.png', '2025-02-10 16:00:00'),
    ('S0076', 'https://i.postimg.cc/3wkmWsK0/vlcsnap-2025-03-03-13h05m46s196.png', '2025-02-10 18:00:00');

-- Session S0077 -- General
INSERT INTO snapshots (session_id, image_url, "timestamp") VALUES
    ('S0077', 'https://i.postimg.cc/7hRdgvFG/vlcsnap-2025-03-03-12h24m40s517.png', '2025-02-10 13:00:00'),
    ('S0077', 'https://i.postimg.cc/MHHgMZFJ/vlcsnap-2025-03-03-12h24m43s916.png', '2025-02-10 15:00:00'),
    ('S0077', 'https://i.postimg.cc/W3XQ1qS7/vlcsnap-2025-03-03-12h24m46s810.png', '2025-02-10 17:00:00'),
    ('S0077', 'https://i.postimg.cc/c4rN6hpt/vlcsnap-2025-03-03-12h24m49s298.png', '2025-02-10 19:00:00');



-- ----------------------------------------------------------------------
-- INCIDENTS
-- ----------------------------------------------------------------------

-- Incidents for session S0028
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0028', '2025-02-01 09:30:00', 'Moderate', 'Open', 'Helmet'),
    ('S0028', '2025-02-01 14:15:00', 'Moderate', 'Resolved', 'Harness');

-- Incidents for session S0029
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0029', '2025-02-01 10:45:00', 'Moderate', 'Resolved', 'Scaffolding'),
    ('S0029', '2025-02-01 15:30:00', 'Critical', 'Open', 'Harness');

-- Incidents for session S0030
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0030', '2025-02-01 12:15:00', 'Moderate', 'Resolved', 'Scaffolding');

-- Incidents for session S0031
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0031', '2025-02-01 11:30:00', 'Moderate', 'Open', 'Gloves'),
    ('S0031', '2025-02-01 13:45:00', 'Moderate', 'Open', 'Guardrail'), 
    ('S0031', '2025-02-01 16:20:00', 'Critical', 'Resolved', 'Helmet'), 
    ('S0031', '2025-02-01 18:10:00', 'Critical', 'Open', 'Vest');

-- Incidents for session S0032
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0032', '2025-02-01 14:00:00', 'Moderate', 'Resolved', 'Shoes');

-- Incidents for session S0033 - No incidents

-- Incidents for session S0034 - No incidents

-- Incidents for session S0035
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0035', '2025-02-02 11:30:00', 'Moderate', 'Open', 'Harness'),
    ('S0035', '2025-02-02 16:45:00', 'Critical', 'Resolved', 'Scaffolding'); 

-- Incidents for session S0036
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0036', '2025-02-02 14:15:00', 'Moderate', 'Resolved', 'Guardrail'); 

-- Incidents for session S0037
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0037', '2025-02-02 17:00:00', 'Moderate', 'Open', 'Guardrail');

-- Incidents for session S0038
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0038', '2025-02-03 10:15:00', 'Moderate', 'Resolved', 'Gloves');

-- Incidents for session S0039
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0039', '2025-02-03 14:30:00', 'Moderate', 'Open', 'Helmet'); 

-- Incidents for session S0040
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0040', '2025-02-03 11:45:00', 'Moderate', 'Open', 'Helmet'),
    ('S0040', '2025-02-03 15:10:00', 'Critical', 'Resolved', 'Scaffolding'), 
    ('S0040', '2025-02-03 17:50:00', 'Critical', 'Open', 'Harness');

-- Incidents for session S0041 - No incidents

-- Incidents for session S0042
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0042', '2025-02-03 16:00:00', 'Moderate', 'Resolved', 'Guardrail');

-- Incidents for session S0043 - No incidents

-- Incidents for session S0044
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0044', '2025-02-04 11:30:00', 'Moderate', 'Open', 'Scaffolding'); 

-- Incidents for session S0045
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0045', '2025-02-04 15:45:00', 'Moderate', 'Resolved', 'Guardrail'); 

-- Incidents for session S0046
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0046', '2025-02-04 13:15:00', 'Moderate', 'Open', 'Harness');

-- Incidents for session S0047
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0047', '2025-02-04 17:00:00', 'Moderate', 'Resolved', 'Gloves');

-- Incidents for session S0048
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0048', '2025-02-05 10:30:00', 'Moderate', 'Open', 'Guardrail');

-- Incidents for session S0049
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0049', '2025-02-05 12:00:00', 'Moderate', 'Resolved', 'Helmet'),
    ('S0049', '2025-02-05 14:45:00', 'Critical', 'Open', 'Scaffolding'), 
    ('S0049', '2025-02-05 16:30:00', 'Critical', 'Open', 'Harness'); 

-- Incidents for session S0050 - No incidents

-- Incidents for session S0051
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0051', '2025-02-05 18:15:00', 'Moderate', 'Open', 'Vest');

-- Incidents for session S0052 - No incidents

-- Incidents for session S0053
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0053', '2025-02-06 10:45:00', 'Moderate', 'Resolved', 'Scaffolding'); 

-- Incidents for session S0054
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0054', '2025-02-06 13:30:00', 'Moderate', 'Open', 'Guardrail'); 

-- Incidents for session S0055
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0055', '2025-02-06 16:15:00', 'Moderate', 'Open', 'Guardrail');

-- Incidents for session S0056
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0056', '2025-02-06 11:00:00', 'Moderate', 'Resolved', 'Harness'),
    ('S0056', '2025-02-06 15:30:00', 'Critical', 'Open', 'Helmet'); 

-- Incidents for session S0057
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0057', '2025-02-06 18:00:00', 'Moderate', 'Resolved', 'Vest'); 

-- Incidents for session S0058
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0058', '2025-02-07 09:45:00', 'Moderate', 'Open', 'Shoes'),
    ('S0058', '2025-02-07 14:20:00', 'Critical', 'Resolved', 'Scaffolding'); 

-- Incidents for session S0059
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0059', '2025-02-07 12:30:00', 'Moderate', 'Open', 'Guardrail');

-- Incidents for session S0060 - No incidents

-- Incidents for session S0061 - No incidents

-- Incidents for session S0062
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0062', '2025-02-07 16:15:00', 'Moderate', 'Resolved', 'Gloves');

-- Incidents for session S0063
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0063', '2025-02-08 11:00:00', 'Moderate', 'Open', 'Helmet'); 

-- Incidents for session S0064
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0064', '2025-02-08 14:30:00', 'Moderate', 'Open', 'Harness');

-- Incidents for session S0065
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0065', '2025-02-08 10:15:00', 'Moderate', 'Resolved', 'Scaffolding'), 
    ('S0065', '2025-02-08 16:45:00', 'Critical', 'Open', 'Guardrail'); 

-- Incidents for session S0066 - No incidents

-- Incidents for session S0067
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0067', '2025-02-08 12:30:00', 'Moderate', 'Open', 'Helmet'),
    ('S0067', '2025-02-08 15:00:00', 'Critical', 'Resolved', 'Scaffolding'),
    ('S0067', '2025-02-08 17:45:00', 'Critical', 'Open', 'Harness'); 

-- Incidents for session S0068
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0068', '2025-02-09 11:15:00', 'Moderate', 'Resolved', 'Gloves');

-- Incidents for session S0069 - No incidents

-- Incidents for session S0070 - No incidents

-- Incidents for session S0071
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0071', '2025-02-09 13:00:00', 'Moderate', 'Open', 'Vest'), 
    ('S0071', '2025-02-09 17:30:00', 'Critical', 'Resolved', 'Gloves'); 

-- Incidents for session S0072
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0072', '2025-02-09 15:45:00', 'Moderate', 'Open', 'Shoes'); 

-- Incidents for session S0073
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0073', '2025-02-10 10:30:00', 'Moderate', 'Resolved', 'Harness'); 

-- Incidents for session S0074
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0074', '2025-02-10 13:15:00', 'Moderate', 'Open', 'Gloves');

-- Incidents for session S0075
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0075', '2025-02-10 16:00:00', 'Moderate', 'Resolved', 'Scaffolding');

-- Incidents for session S0076
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0076', '2025-02-10 11:45:00', 'Moderate', 'Open', 'Harness'),
    ('S0076', '2025-02-10 15:30:00', 'Critical', 'Open', 'Guardrail'); 

-- Incidents for session S0077
INSERT INTO incidents (session_id, incident_time, severity, status, category) VALUES
    ('S0077', '2025-02-10 18:15:00', 'Moderate', 'Resolved', 'Helmet'); 



-- ----------------------------------------------------------------------
-- SAFETY SCORE TRENDS
-- ----------------------------------------------------------------------

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



-- ----------------------------------------------------------------------
-- SAFETY SCORE DISTRIBUTION
-- ----------------------------------------------------------------------

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



-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------
-- Section 3: Data Updation
-- ----------------------------------------------------------------------
-- ----------------------------------------------------------------------

-- Update safetyScore in construction_sites

UPDATE construction_sites
SET safetyScore = subquery.avg_safety_score
FROM (
    SELECT s.site_id, AVG(s.safety_score) AS avg_safety_score
    FROM sessions s
    GROUP BY s.site_id
) AS subquery
WHERE construction_sites.site_id = subquery.site_id;