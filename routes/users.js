var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// route to create event
router.post('/create-event', (req, res, next) => {
  const {
    eventName,
    dateTime,
    location,
    desc,
    clubId
  } = req.body;

  req.pool.getConnection((error, connection) => {
    if (error) {
      res.status(500).send('Error getting database connection');
      return;
    }

    const eventQuery = 'INSERT INTO event (event_name, event_datetime, event_location, event_desc, club_id) VALUES (?, ?, ?, ?, ?)';
    const eventValues = [eventName, dateTime, location, desc, clubId];

    connection.query(eventQuery, eventValues, (eerror, results) => {
      connection.release();

      if (eerror) {
        res.status(500).send('Error creating event.');
        return;
      }

      res.sendStatus(200);
    });
  });
});



module.exports = router;
