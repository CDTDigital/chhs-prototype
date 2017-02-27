var ifishEmail = require('./ifishEmail')
var ifishDAL = require('./ifishDAL')
var twilioSMS = require('./twiliosms')
var dal = new ifishDAL()

var ifishAlert = function () {
  this.send = function(message, twilioConfig) {    

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
  }  
}

module.exports = ifishAlert
