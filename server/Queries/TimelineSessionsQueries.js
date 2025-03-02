const getAllSessions = `
    SELECT
        s.session_id AS "sessionId",
        s.safety_score AS "safetyScore",
        s.mode,
        to_char(s.start_time, 'YYYY-MM-DD HH24:MI:SS') AS "startTime",
        to_char(s.end_time, 'YYYY-MM-DD HH24:MI:SS') AS "endTime"
    FROM
        sessions s
    ORDER BY
        s.start_time DESC;
`;

//add construction sites and cameras in above query


//add query for per id from line 217 timelinesessions.jsx

module.exports = {
    getAllSessions,
};
// const getSessionById =

module.exports = {
    getAllSessions,
    getSessionById
};
