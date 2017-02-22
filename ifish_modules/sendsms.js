var twilioClient = require('twilioClient')

function formatMessage(errorToReport) {
  return '[This is a test] ALERT! It appears the server is' +
    'having issues. Exception: ' + errorToReport +
    '. Go to: http://newrelic.com ' +
    'for more details.'
}

var ifishSMS = function(phoneNumber, textMessage) {
  var messageToSend = formatMessage(textMessage)
  twilioClient.sendSms(phoneNumber, messageToSend)
}

module.exports = ifishSMS
