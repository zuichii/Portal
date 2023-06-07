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
    var query = "SELECT * FROM user WHERE user_name = ? AND password = ?";
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


router.get('/club_profile', function(req, res, next) {
  var clubId = req.query.id;

  req.pool.getConnection(function(err, connection) {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // get club data
    var clubQuery = "SELECT club_name, club_description FROM club WHERE club_id = ?";
    connection.query(clubQuery, [clubId], function(qerr, clubRows) {
      if (qerr) {
        console.error('Error executing club query:', qerr);
        connection.release();
        res.status(500).send('Internal Server Error');
        return;
      }

      if (clubRows.length > 0) {
        var clubData = clubRows[0];

        // get number of posts
        var postsQuery = "SELECT COUNT(*) AS num_posts FROM post WHERE club_id = ?";
        connection.query(postsQuery, [clubId], function(perr, postsRows) {
          if (perr) {
            console.error('Error executing posts query:', perr);
            connection.release();
            res.status(500).send('Internal Server Error');
            return;
          }

          if (postsRows.length > 0) {
            clubData.num_posts = postsRows[0].num_posts;
          } else {
            clubData.num_posts = 0;
          }

          // get number of members
          var membersQuery = "SELECT COUNT(*) AS num_members FROM club_membership WHERE club_id = ?";
          connection.query(membersQuery, [clubId], function(merr, membersRows) {
            connection.release();
            if (merr) {
              console.error('Error executing members query:', merr);
              res.status(500).send('Internal Server Error');
              return;
            }

            if (membersRows.length > 0) {
              clubData.num_members = membersRows[0].num_members;
            } else {
              clubData.num_members = 0;
            }

            res.json(clubData);
          });
        });
      } else {
        connection.release();
        res.sendStatus(404);
      }
    });
  });
});


















module.exports = router;
