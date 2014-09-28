/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    signIn: function(req, res) {
//http://localhost:1337/user/signIn?email=purkin_viktor@mail.ru&password=viktor
        var email = req.param('email'); //req.body.email
        var password = req.param('password');
        var bcrypt = require('bcrypt-nodejs');
        User.findOneByEmail(email, function(err, user) {
            if (err) {
                res.send({error_code: ErrorCode.Code.DB_ERR, err: err});
            }
            if (user) {
                bcrypt.compare(password, user.password, function(err, match) {
                    if (err)
                        res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err});
                    if (match) {
                        req.session.user = user;
                        res.send(user);
                    } else {
                        // invalid password
                        if (req.session.user)
                            req.session.user = null;
                        res.send({error_code: ErrorCode.Code.INVALID_PASSWORD}, 400);
                    }
                });
            } else {
                res.send({error_code: ErrorCode.Code.USER_NOT_FOUND}, 404);
            }
        });
        //return res.send({email: email, password: password});
    },
    signUp: function(req, res) {
        //http://localhost:1337/user/signUp?email=purkin_viktor@mail.ru&password=viktor&name=viktor
        var name = req.param('name');
        var email = req.param('email'); //req.body.email
        var password = req.param('password');
        //var linkAvatar = req.param('linkAvatar'); //|| "";

        var newUser = {
            name: name,
            email: email,
            password: password
        };
        User.findOneByEmail(email).exec(function(err, user) {
            if (err)
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
            if (user) {
                return res.send({error_code: ErrorCode.Code.USER_EXISTS});
            } else
            {
                function HandleErr(err, user)
                {
                    res.send({error: ErrorCode.Code.DB_ERR, err: err}, 500);
                    res.send(user);
                }
                User.create(newUser, HandleErr);

                /*
                 .exec(function(err, created) {
                 if (err) {
                 res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
                 }
                 res.send(created);
                 })
                 */
            }

        });
    },
    signOut: function(req, res) {
        req.session.user = null;
        res.send({error_code: ErrorCode.Code.NO_ERR, status: Status.Code.OK}, 200);
    },
    viewUpload: function(req, res) {
        //http://localhost:1337/user/viewUpload
        res.view('user/viewUpload');
    },
    upload: function(req, res) {

        req.file('avatar')
                .on('error', function onError(err) {
                    res.send({error: ErrorCode.Code.SERVER_ERR, err: err}, 500);
                })
                .upload({
                    dirname: req.session.user.email + '/',
                    saveAs: function(fileStream, cb) {
                        var ext = Helper.getExtFile(fileStream.filename);
                        var newFileName = Consts.NAME_AVATAR_FILE + '.' + ext;
                        User.findOne(req.session.user.id).exec(function(err, user) {
                            if (err) {
                                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
                            }
                            user.fileAvatar = newFileName;
                            user.save(
                                    function(err, user)
                                    {
                                        if (err) {
                                            res.send({error_code: ErrorCode.Code.DB_ERR, err: err});
                                            console.log(err);
                                        }
                                    }
                            );
                        });
                        cb(null, newFileName);
                    }
                }, function(err, files) {
                    if (err)
                        return res.serverError(err);
                    //console.log(err);
                    return res.json({
                        message: files.length + ' Выгрузка файл(ов) завершена!',
                        files: files
                    });
                });
    },
    recoverPage: function(req, res) {

        //http://localhost:1337/user/recoverPage
        var key = req.param('key');
        //console.log(this);
        var email = req.param('email');
        var Guid = require("guid");
        if (Guid.isGuid(key))
        {
            User.findOneByEmail(email, function(err, user) {
                if (err)
                    res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
                if (user) {
                    var guid = new Guid(user.guid);
                    var dateGuid = new Date(user.guidCreatedTime);
                    dateGuid.setMinutes(dateGuid.getMinutes() + sails.config.custom.COUNT_MINUTES_FOR_RECOVER_PASSWORD);
                    var curentData = new Date();
                    if (guid.equals(new Guid(key)) && (dateGuid > curentData))
                    {
                        var confirm_password = req.param('confirm_password');
                        var password = req.param('password');
                        if (password && confirm_password) {
                            if (password === confirm_password) {
                                user.password = User.cryptPassword(password);
                                user.guidCreatedTime = new Date().setTime(0);

                                user.save(function(err) {
                                    //console.log(err);
                                    if (err) {
                                        res.send({error: ErrorCode.Code.DB_ERR, err: err}, 500);
                                    } else {
                                        res.send({error_code: ErrorCode.Code.NO_ERR, status: Status.Code.OK}, 200);
                                    }
                                });
                            } else {
                                res.send({error: ErrorCode.Code.INVALID_PASSWORD}, 400);
                            }
                        } else {
                            res.view('user/recoverPage', {
                                message: 'Recover password!',
                                action: UserService.getRecoverUrl(),
                                email: user.email,
                                key: user.guid
                            });
                        }
                    }
                    else
                    {
                        res.send({error: ErrorCode.Code.KEY_ERR}, 400);
                    }

                } else
                {
                    res.send({error_code: ErrorCode.Code.USER_NOT_FOUND}, 200);
                }
            });
        }
        else {
            res.send({error_code: ErrorCode.Code.NON_KEY}, 500);
        }
        // res.view('home/login', {message: 'Login failed!', layout: null}); 
    },
    recoverPassword: function(req, res) {
        //http://localhost:1337/user/recoverPassword?email=viktor@mail.ru
        var email = req.param('email');
        User.findOneByEmail(email, function(err, user) {
            if (err)
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
            if (user) {

                var Guid = require("guid");
                var guid = Guid.create();
                var email = {
                    name: user.name,
                    link: UserService.getRecoverUrl({email: user.email, key: guid}),
                    // link: "http://localhost:1337/user/recoverPage?email=" + user.email + "&key=" + guid,
                    email: user.email
                };
                user.guidCreatedTime = new Date();
                user.guid = guid.value;
                user.save(function(err) {
                    console.log(err);
                });
                EmailService.sendInviteEmail(email,
                        function(error, response) {
                            if (error) {
                                console.log(error);
                                res.send({error_code: ErrorCode.Code.SEND_EMAIL_ERR, err: err});
                            } else {
                                //ServerResponsService.getStatus(Status.Code.OK)
                                res.send({error_code: ErrorCode.Code.NO_ERR, status: Status.Code.OK}, 200);
                                console.log(response);
                            }
                        }
                );
            } else
            {
                res.send({error_code: ErrorCode.Code.USER_NOT_FOUND}, 200);
            }
        });
    },
    reName: function(req, res) {
        //http://localhost:1337/user/reName?name=viktor

        var name = req.param('name');
        User.findOne(req.session.user.id).exec(function(err, user) {
            console.log(err);
            if (err) {
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
            }
            user.name = name;
            user.save(
                    function(err, user)
                    {
                        if (err) {
                            res.send({error_code: ErrorCode.Code.DB_ERR, err: err});
                        } else {
                            res.send(user);
                        }
                    }
            );
        });
    },
    getLinkAvatar: function(req, res) {
        return  res.send({url: "user/douwloadAvatarFile"});
    },
    douwloadAvatarFile: function(req, res) {
        http://localhost:1337/user/douwloadAvatarFile
                var dir = req.session.user.email;
        res.download('.tmp/uploads/' + dir + '/' + req.session.user.fileAvatar, Consts.NAME_AVATAR_FILE, function(err) {
            if (err) {
                res.status(err.status).end();
            }
        });
    }

};

