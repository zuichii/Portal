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


const bcrypt = require('bcrypt');


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

    // Hash the password
    bcrypt.hash(password, 10, function(err, hashedPassword) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      // Insert the new user into the database with the hashed password
      const newUser = {
        user_name: username,
        email: email,
        password: hashedPassword
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
});


router.post('/login', async function(req, res) {
  if ('username' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      var { username, password } = req.body;
      var query = "SELECT * FROM user WHERE user_name = ?";

      connection.query(query, [username], function(qerr, results) {
        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        if (results.length === 1) {
          var user = results[0];
          bcrypt.compare(password, user.password, function(bcryptErr, isMatch) {
            if (bcryptErr) {
              console.error(bcryptErr);
              return res.sendStatus(500);
            }

            if (isMatch) {
              req.session.user = user;
              console.log("User logged in:", user.user_name);
              res.status(200).json(user);
            } else {
              res.sendStatus(401);
            }
          });
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
    res.sendStatus(200);
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

//user updates profile
router.post('/update_user', function(req, res, next) {
  var updated_email = req.body.email;
  var updated_username = req.body.username;
  var updated_password = req.body.password;

  // Update the user's information in the database using database operations or queries
  req.pool.getConnection(function(err, connection) {
    if (err) {
      return next(err);
    }

    var query = "UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?";
    var values = [updated_email, updated_username, updated_password, req.session.user.id];

    connection.query(query, values, function(qerr, results) {
      connection.release();

      if (qerr) {
        return next(qerr);
      }

      res.json({ message: "User information updated successfully" });
    });
  });
});


router.get('/get_current_user_info', (req, res) => {
  const userId = req.session.user.user_id;
  const sql = `SELECT user_name, email, password FROM user WHERE user_id = ${userId}`;

  req.pool.getConnection(function(err, connection) {
    connection.query(sql, (ierr, result) => {
      if (ierr) {
        console.error('Error executing the SQL query:', ierr);
        res.sendStatus(500);
        return;
      }

      if (result.length == 0) {
        res.sendStatus(404);
      }

      const userInfo = {
        user_name: result[0].user_name,
        email: result[0].email,
        password: result[0].password,
      };

      res.json(userInfo);
    });
  });
});



router.post('/subscribe', function(req, res, next) {
  const { userId, clubId } = req.body;

  req.pool.getConnection(function(error, connection) {
    if (error) {
      console.log('Error getting database connection:', error);
      res.status(500).send('Error getting database connection');
      return;
    }

    const check = 'SELECT * FROM club_membership WHERE user_id = ? AND club_id = ?';

    connection.query(check, [userId, clubId], function(merror, results) {
      if (merror) {
        console.log('Error checking membership:', merror);
        res.status(500).send('Error checking membership');
        connection.release(); // Release the connection back to the pool
        return;
      }

      if (results.length > 0) {
        console.log('User already subscribed to the club');
        res.status(400).send('User already subscribed to the club');
        connection.release(); // Release the connection back to the pool
        return;
      }

      const subscribe = 'INSERT INTO club_membership (membership_type, user_id, club_id) VALUES (?, ?, ?)';

      connection.query(subscribe, ['member', userId, clubId], function(serror) {
        connection.release(); // Release the connection back to the pool

        if (serror) {
          console.log('Error inserting membership:', serror);
          res.status(500).send('Error inserting membership');
          return;
        }

        res.sendStatus(200);
      });
    });
  });
});


router.post('/unsubscribe', function(req, res, next) {
  const { userId, clubId } = req.body;

  req.pool.getConnection((err, connection) => {
    if (err) {
      console.log('error getting database connection');
      res.status(500).send('error getting database connection');
      return;
    }

    const check = 'SELECT * FROM club_membership WHERE user_id = ? AND club_id = ?';

    connection.query(check, [userId, clubId], (error, results) => {
      if (error) {
        console.log('error');
        res.status(500).send('error');
        connection.release();
        return;
      }

      if (results.length === 0) {
        res.status(400).send('User is not subscribed to the club');
        connection.release();
        return;
      }

      const unsubscribe = 'DELETE FROM club_membership WHERE user_id = ? AND club_id = ?';

      connection.query(unsubscribe, [userId, clubId], (serror) => {
        if (serror) {
          console.log('error unsubscribing user from club');
          res.status(500).send('error unsubscribing user from club');
          connection.release();
          return;
        }

        res.status(200).send('User unsubscribed from club');
        connection.release();
      });
    });
  });
});




module.exports = router;
