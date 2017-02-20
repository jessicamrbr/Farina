/*
#####################
# Required modules  #
#####################
*/
var express = require('express');
var conf = require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var swaggerJSDoc = require('swagger-jsdoc');

/*
#######################
# Required sub routes #
#######################
*/
var index = require('./routes/index');
var col_aux_cids = require('./routes/col_aux_cids');
var col_aux_drgs = require('./routes/col_aux_drgs');
var col_aux_generos = require('./routes/col_aux_generos');
var col_prontuarios = require('./routes/col_prontuarios');
var col_usuarios = require('./routes/col_usuarios');

/*
#######################
# Initialize API      #
#######################
*/
var app = express();

/*
#######################
# Connect Data Base   #
#######################
*/
var connection = mongoose.connect(process.env.DB_HOST, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectTimeoutMS: 0
    }
  }
});
mongoose.Promise = global.Promise;

/*
#######################
# Initialize DOCs     #
#######################
*/
var swaggerDefs = require("./swaggerDefs.js");
var swaggerSpec = swaggerJSDoc({
  swaggerDefinition: swaggerDefs.main,
  apis: ['./controller/*.js']
});
swaggerSpec.securityDefinitions = swaggerDefs.securityDefinitions;
swaggerSpec.definitions = swaggerDefs.definitions;
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/*
##############################
# Setup Jade how view engine #
##############################
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
#######################################
# Permission cross domain requisition #
#######################################
*/
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

/*
#######################
# Define sub routes   #
#######################
*/
app.use('/', index);
app.use('/col_aux_cids', col_aux_cids);
app.use('/col_aux_drgs', col_aux_drgs);
app.use('/col_aux_generos', col_aux_generos);
app.use('/col_prontuarios', col_prontuarios);
app.use('/col_usuarios', col_usuarios);

/*
########################
# Define common errors #
########################
*/
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

/*
########################
# Provides initial API #
########################
*/
module.exports = app;
