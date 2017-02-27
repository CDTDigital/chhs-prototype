var sendmail = require('sendmail')({silent: false})

module.exports.sendHtml = function sendHtml(sendTo, subject, htmlMessage) {
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


module.exports.sendPlainText = function sendPlainText(sendTo, subject, plainText) {
    sendmail({
        from: 'test@example.com',
        to: sendTo,
        replyTo: 'test@example.com',
        subject: subject,
        text: plainText
        }, function (err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
    })
}
