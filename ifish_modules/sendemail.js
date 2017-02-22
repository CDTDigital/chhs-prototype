var sendmail = require('sendmail')({silent: false})

var ifishEmail = function(sendTo, subject, messageHtml) {
    sendmail({
        from: 'test@ifishgroup.com',
        to: sendTo,
        replyTo: 'test@ifishgroup.com',
        subject: subject,
        html: messageHtml
        }, function (err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
    })
}

module.exports = ifishEmail
