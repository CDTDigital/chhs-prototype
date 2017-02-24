var express = require('express')
var bodyParser = require('body-parser')


var app = express()

//http
var portnum = 3000

app.use(function (req, res, next) {

   res.header("Access-Control-Allow-Origin", req.headers.origin);
   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   next();

});

//serve the public directory
app.use(express.static(__dirname + '/public'))

//json
app.use(bodyParser.json());

//listen
app.listen(portnum, null, null, function () {
  console.log('Web API Listening on port ' + portnum + '...')
})

