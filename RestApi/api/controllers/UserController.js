/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = { 
    signIn: function(req, res) {
        //http://localhost:1337/user/signIn?e=viktor@mail.ru&p=VASA
        var email = req.param('e'); //req.body.email
        var password = req.param('p');
        var bcrypt = require('bcrypt-nodejs');

        User.findOneByEmail(email).exec(function(err, user) {
            if (err) {
                res.json({error: 'DB error'}, 500);
            }
            if (user) {
                bcrypt.compare(password, user.password, function(err, match) {
                    if (err)
                        res.json({error: 'Server error'}, 500);

                    if (match) {
                        // password match
                        //req.session.user = user.id;
                        req.session.user = user;
                        res.json(user);
                    } else {
                        // invalid password
                        if (req.session.user)
                            req.session.user = null;
                        res.json({error: 'Invalid password'}, 400);
                    }
                });
            } else {
                res.json({error: 'User not found', email: email}, 404);
            }
        });
        //return res.send({email: email, password: password});
    },
    signUp: function(req, res) {
        //http://localhost:1337/user/signUp?e=viktor@mail.ru&p=viktor&n=viktor
        var name = req.param('n');
        var email = req.param('e'); //req.body.email
        var password = req.param('p');
        var newUser = {name: name, email: email, password: password};
        User.findOneByEmail(email).exec(function(err, user) {
            if (err)
                res.json({error: 'Server error'}, 500);

            if (user) {
                return res.send({err: "User with this email already exists!"});

            } else
            {
                User.create(newUser).exec(function createCB(err, created) {
                    if (err) {
                        res.send({error: 'Server error', err: err}, 500);
                    }
                    res.send(created);
                });
            }

        });
    },
    signOut: function(req, res) {
        req.session.user = null;
        res.send({msg: 'Out'}, 200);
    }
};

