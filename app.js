require('./db/models')

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var chalk = require('chalk');
var session=require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var story = require('./routes/story.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:"qazwsxedcrfvtgbyhnujm",resave: true, saveUninitialized: true}));


app.use('/', index);
app.use('/users', users);
app.use('/stories',story);

app.use(function(req, res) {
  console.log(chalk.red('Error: 404'));
  res.status(404).render('404');
});

app.use(function(err, req, res, next) {
  console.log(chalk.red('Error : 500'+err));
  res.status(500).render('500');
});

module.exports = app;
