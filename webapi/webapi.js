var express = require('express')
var bodyParser = require('body-parser')
var ifishDAL = require('../ifish_modules/ifishDAL')

var dal = new ifishDAL()
var app = express()

//http
var portnum = 8081

//serve the public directory
app.use(express.static(__dirname))

//json
app.use(bodyParser.json());

//listen
app.listen(portnum, null, null, function() {
  console.log('Web API Listening on port ' + portnum + '...')
})

//Get user profile
app.get('/userprofile', function(req, res) {
  dal.GetUserProfile(function(docs) {
    console.dir({'function': 'userprofile', 'method': 'GET', 'docs': docs})
    res.writeHead(200, {"Content-Type": "application/json"})
    res.end(JSON.stringify(docs))
  })
})

app.put('/userprofile', function(req, res) {
  dal.SetUserProfile(req.body, function(docs) {
    console.dir({'function': 'userprofile', 'method': 'PUT', 'docs': req.body})
    res.writeHead(200, {"Content-Type": "application/json"})
    res.end(JSON.stringify({}))
  })  
})