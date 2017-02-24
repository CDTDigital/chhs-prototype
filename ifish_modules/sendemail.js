var sendmail = require('sendmail')({silent: false})

var ifishEmail = function() {
    this.send = function(sendTo, subject, htmlMessage) {
        sendmail({
            from: 'test@example.com',
            to: sendTo,
            replyTo: 'test@example.com',
            subject: subject,
            html: htmlMessage
            }, function (err, reply) {
                console.log(err && err.stack)
                console.dir(reply)
        })
    }
}

module.exports = ifishEmail

var email = new ifishEmail()
