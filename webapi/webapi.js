var express = require('express')
var bodyParser = require('body-parser')
var ifishDAL = require('../ifish_modules/ifishDAL')
var ifishAlert = require('../ifish_modules/ifishAlert')

var dal = new ifishDAL()
var alert = new ifishAlert()
var app = express()

//http
var portnum = 8081

//twilio config from environment
var twilioConfig = { 
  accountSid : process.env.TWILIO_ACCOUNT_SID,
  authToken : process.env.TWILIO_AUTH_TOKEN,
  fromTwilioNumber : process.env.TWILIO_SENDING_NUMBER
}

var requiredConfig = [twilioConfig.accountSid, twilioConfig.authToken, twilioConfig.fromTwilioNumber];
var isConfigured = requiredConfig.every(function(configValue) {  
  return configValue || false;
});
twilioConfig.isConfigured = isConfigured
if (!twilioConfig.isConfigured) {
  console.log('Invalid Twilio configuration.')
  console.log('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set in order to send SMS');  
}

app.use(function (req, res, next) {

   res.header("Access-Control-Allow-Origin", req.headers.origin);
   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   next();

});

//json
app.use(bodyParser.json());

//listen
app.listen(portnum, null, null, function () {
  console.log('Web API Listening on port ' + portnum + '...')
})

//Get user profile
app.get('/userprofile', function (req, res) {
  dal.GetUserProfile(function (docs) {
    console.dir({ 'function': 'userprofile', 'method': 'GET', 'docs': docs })
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(docs))
  })
})

app.put('/userprofile', function (req, res) {
  dal.SetUserProfile(req.body, function (docs) {
    console.dir({ 'function': 'userprofile', 'method': 'PUT', 'docs': req.body })
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({}))
  })
})

app.post('/sendalert', function (req, res) {
  alert.send(req.body, twilioConfig)
  console.dir({ 'function': 'sendalert', 'method': 'POST', 'docs': req.body })  
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(JSON.stringify({}))  
})

app.get('/notifications', function (req, res) {
  dal.GetAlertHistory(function (docs) {
    console.dir({ 'function': 'notifications', 'method': 'GET', 'docs': docs })
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(docs))
  })
})
