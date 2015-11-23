var express = require('express'),
    exphbs  = require('express-handlebars'),
    expressLess = require('express-less'),
    app = express(),
    bodyParser = require('body-parser'),
    projectFolder = __dirname + '/mybook/',
    fs = require('fs')
;

app.use('/css', expressLess(__dirname + '/less', {
  debug: true
}));

app.use('/', express.static('./samples'));
app.use('/src', express.static('./src'));

app.use(bodyParser.json({limit: '50mb'}));

module.exports = {
  start: function (port) {
    console.log('Starting main app on port ' + port);
    app.listen(port);
  }  
};
