CREATE TABLE USERS (
    Uid SERIAL PRIMARY KEY,                   
    Username VARCHAR(50) UNIQUE NOT NULL,  
    Uemail VARCHAR(100) UNIQUE NOT NULL,       
    password TEXT NOT NULL,                   
    role VARCHAR(20) CHECK (role IN ('admin', 'standard')) NOT NULL, 
    last_signin TIMESTAMP DEFAULT NULL  
);
