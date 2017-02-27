var twilioLibrary = require('twilio');

var twilioSMS = function () {
  this.send = function(phone, textMessage, twilioConfig) {    
    var plusTenDigit = '+1' + phone
    var client = new twilioLibrary.Twilio(twilioConfig.accountSid, twilioConfig.authToken)
    client.messages.create({        
        body: textMessage,
        to: plusTenDigit,  // Text this number
        from: twilioConfig.fromTwilioNumber 
        }, function(err, message) {
            console.log(message.sid)
    })
  }
}

module.exports = twilioSMS

