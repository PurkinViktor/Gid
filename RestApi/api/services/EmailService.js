exports.sendInviteEmail = function(options, cb) {

    var nodemailer = require("nodemailer");
    var smtpTransport = nodemailer.createTransport({
        service: "Mail.ru",
        auth: {
            user: sails.config.custom.EMAIL_USER,
            pass: sails.config.custom.EMAIL_PASS
        }
    });
    smtpTransport.sendMail({
        from: "purkin_viktor@mail.ru", // sender address
        to: options.email, // comma separated list of receivers
        subject: "Recover password ✔", // Subject line
       // text: "Dear " + options.name + ",\nYou're in the Beta! Click by link to recover your password ✔",
        html: "Dear " + options.name + ",\nYou're in the Beta! Click by link to recover your password ✔ "+"<a href=\"" + options.link + "\">Recover password ✔</a>" // html body
    }, cb);
};