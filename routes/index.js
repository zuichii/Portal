var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// signin post request
router.post('/signin', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if(err){
      res.sendStatus(500);
      return;
    }
    var username = req.body.username;
    var password = req.body.password;
    var query = "SELECT * FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], function(qerr, results) {
      connection.release();
      if(qerr){
        res.sendStatus(500);
        return;
      }
      if(results.length === 1){
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    });
  });
});

module.exports = router;
