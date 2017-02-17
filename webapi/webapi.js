var express = require('express')
var app = express()

//http
var portnum = 8080

//serve the public directory
app.use(express.static(__dirname))

//listen
app.listen(portnum, null, null, function() {
  console.log('Web API Listening on port ' + portnum + '...')
})