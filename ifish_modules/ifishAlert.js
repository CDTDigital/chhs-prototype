var ifishEmail = require('./ifishEmail')
var ifishDAL = require('./ifishDAL')
var twilioSMS = require('./twiliosms')
var dateFormat = require('dateformat');

var dal = new ifishDAL()

var ifishAlert = function () {
  this.send = function(message, twilioConfig) {    
     var now = new Date();

     var log = {
              'Date': dateFormat(now, "shortDate"),
              'Time': dateFormat(now, "shortTime"),
              'Title': message.title,
              'Message': message.message,
              'Type': message.type,
              'Lat': message.lat,
              'Long': message.long,
              'SMSCount': message.sendSMS?1:0, 
              'EmailCount': message.sendEmail?1:0
            }

    if (message.sendEmail) {
      dal.GetUserProfile(function (user) {
        console.log('will call sendHtml with ' + user.Email + ' and ' + message.message)
        //ifishEmail.sendHtml(user.Email, "ADPQ Test", message.Message)          
      })
    }

    if (twilioConfig.isConfigured) {
      if (message.sendSMS) {
        dal.GetUserProfile(function (user) {
          console.log('will call send with ' + user.Phone + ' and ' + message.message)
          console.dir(twilioConfig)
          //twilioSMS.send(user.Phone, message.Message, twilioConfig)          
        })
      }
    }

    console.dir(log)
    dal.InsertAlertHistory(log, function() {})

  }  
}

module.exports = ifishAlert
