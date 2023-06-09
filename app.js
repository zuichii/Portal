var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

// mysql use
var mysql = require('mysql');

var dbConnectionPool = mysql.createPool({
  host: 'localhost',
  database: 'bitl'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.json());

// use database
app.use(function(req, res, next){
  req.pool = dbConnectionPool;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'super secret string',
  secure: false
}));

app.use(function(req, res, next) {
  if (req.session.user) {
    console.log("The current user is: " + req.session.user.user_name);
  } else {
    console.log("No user logged in");
  }
  next();
});

//user updates profile
app.post('/update_user', function(req, res, next) {
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

    connection.query(query, values, function(err, results) {
      connection.release();

      if (err) {
        return next(err);
      }

      res.json({ message: "User information updated successfully" });
    });
  });
});



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error', // Add this line to define the title variable
  });
});




module.exports = app;
