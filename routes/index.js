var express = require('express');
var router = express.Router();



const CLIENT_ID = 'MY-CLIENT-ID.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// signin post request
// router.post('/signin', function(req, res) {
//   req.pool.getConnection(function(err, connection) {
//     if(err){
//       res.sendStatus(500);
//       return;
//     }
//     var username = req.body.username;
//     var password = req.body.password;
//     var query = "SELECT * FROM user WHERE user_name = ? AND password = ?";
//     connection.query(query, [username, password], function(qerr, results) {
//       connection.release();
//       if(qerr){
//         res.sendStatus(500);
//         return;
//       }
//       if(results.length === 1){
//         res.sendStatus(200);
//       } else {
//         res.sendStatus(401);
//       }
//     });
//   });
// });


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


router.get('/get_posts', function(req, res, next) {
  var clubId = req.query.id;

  // Query the database to fetch posts for the given club_id
  var query = 'SELECT * FROM post WHERE club_id = ?';
  req.pool.query(query, [clubId], function(err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts.' });
    } else {
      res.json(results);
    }
  });
});


router.get('/get_events', function(req, res, next) {
  var clubId = req.query.id;

  // Query the database to fetch posts for the given club_id
  var query = 'SELECT * FROM event WHERE club_id = ?';
  req.pool.query(query, [clubId], function(err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events.' });
    } else {
      res.json(results);
    }
  });
});



router.get('/get_club_description', function(req, res, next) {
  var clubId = req.query.id;

  // Query the database to fetch posts for the given club_id
  var query = 'SELECT * FROM club WHERE club_id = ?';
  req.pool.query(query, [clubId], function(err, results) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events.' });
    } else {
      var clubData = {
        club_description: results[0].club_description
      };
      res.json(clubData);
    }
  });
});


router.post('/createacc', function(req, res, next) {
  const { username, email, password } = req.body;

  // Check if the username or email already exists in the database
  var query = 'SELECT * FROM user WHERE user_name = ? OR email = ?';
  req.pool.query(query, [username, email], function(error, results) {
    if (error) {
      console.error(error);
      return res.sendStatus(500);
    }

    if (results.length > 0) {
      // Check if the username is already taken
      const isUsernameTaken = results.some(function(user) {
        return user.user_name === username;
      });

      if (isUsernameTaken) {
        return res.sendStatus(401);
      }

      // Check if the email is already taken
      const isEmailTaken = results.some(function(user) {
        return user.email === email;
      });

      if (isEmailTaken) {
        return res.sendStatus(402);
      }
    }

    // Insert the new user into the database
    const newUser = {
      user_name: username,
      email: email,
      password: password
    };

    var insertquery = 'INSERT INTO user SET ?';
    req.pool.query(insertquery, newUser, function(ierror) {
      if (ierror) {
        console.error(ierror);
        return res.sendStatus(500);
      }

      return res.sendStatus(200);
    });
  });
});


router.post('/login', async function(req, res) {
  if ('username' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      var { username, password } = req.body;
      var query = "SELECT * FROM user WHERE user_name = ? AND password = ?";

      connection.query(query, [username, password], function(qerr, results) {
        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        if (results.length === 1) {
          var user = results[0];
          req.session.user = user;
          console.log("User logged in:", user.user_name);
          res.json(user);
        } else {
          res.sendStatus(401);
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/logout', function (req, res, next) {
  if ('user' in req.session) {
    delete req.session.user;
    res.end();
  } else {
    res.sendStatus(403);
  }
});


router.post('/google_login', async function (req, res, next) {
  const ticket = await client.verifyIdToken({
    idToken: req.body.credential,
    audience: CLIENT_ID
  });

  const payload = ticket.getPayload();
  const { email } = payload;

  // Search for user by email in the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT * FROM user WHERE email = ?";
    connection.query(query, [email], function (qerr, results) {
      connection.release();

      if (qerr) {
        res.sendStatus(500);
        return;
      }

      if (results.length === 1) {
        var user = results[0];
        req.session.user = user;
        console.log("User logged in:", user.user_name);
        res.json(user);
      } else {
        res.sendStatus(401);
      }
    });
  });
});






module.exports = router;
