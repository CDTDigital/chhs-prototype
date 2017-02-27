//Since emails are not going out from an smtp server,
//the provider's email filter eats up the message
//and the text never arrives

var ifishEmail = require('./ifishEmail')

 /*
 Provider domains:
 AT&T @txt.att.net
 Verizon @vtext.com
 T-Mobile @tmomail
 Sprint @messaging.sprintpcs.com
 Virgin @vmobl.com
 */

var ifishSMS = function () {
  this.send = function(phone, providerDomain, textMessage) {    
    var smsAddress = phone + providerDomain
    console.log('sending sms to ' + smsAddress)
    ifishEmail.sendPlainText(smsAddress, "Test SMS", textMessage)
  }  
}

module.exports = ifishSMS

