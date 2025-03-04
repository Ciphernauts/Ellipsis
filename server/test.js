const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'root',
    database: 'ObjectDetection'
});

client.connect()

// Insert data into the table
const insertQuery = `
    INSERT INTO phase_1_detections (timestamp, person, helmet, no_helmet, vest, no_vest, glove, no_glove, shoe, no_shoe) 
    VALUES 
    ('2023-10-27 10:01:00', 5, 3, 2, 4, 1, 2, 3, 5, 0),
    ('2023-10-27 11:10:00', 8, 6, 2, 7, 1, 5, 3, 8, 0),
    ('2023-10-27 12:10:00', 3, 1, 2, 2, 1, 0, 3, 3, 0),
    ('2023-10-27 13:10:00', 10, 8, 2, 9, 1, 7, 3, 10, 0)
`;

client.query(insertQuery, (err, res) => {
    if (!err) {
        console.log('Data inserted successfully');
    } else {
        console.log(err.message);
    }

    // Select data from the table
    client.query('SELECT * FROM phase_1_detections', (err, res) => {
        if (!err) {
            console.log(res.rows);
        } else {
            console.log(err.message);
        }
        client.end();
    });
});