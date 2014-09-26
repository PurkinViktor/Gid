/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
//    types: {
//        password: function(password) {
//            console.log(password);
//            return password === "123456";
//        }
//    },
    attributes: {
        name: {
            type: 'string',
            required: true,
            minLength: 4
        },
        email: {
            type: 'string',
            unique: true,
            required: true
        },
        password: {
            type: 'string',
            required: true,
            //password: true,
            minLength: 4
        },
        linkAvatar: {
            type: 'string'
        },
        guid: {
            type: 'string'
        },
        guidCreatedTime: {
            type: 'datetime'
        }
    },
    validationMessages: {
        name: {
            required: "Вы не заполнили имя."
        }
    },
    cryptPassword: function(password) {
        var bcrypt = require('bcrypt-nodejs');
        return bcrypt.hashSync(password);

    },
    beforeCreate: function(attrs, next) {
        attrs.password = this.cryptPassword(attrs.password);
        next();

    }
//    beforeUpdate: function(attrs, next) {
//        var bcrypt = require('bcrypt-nodejs');
//
//        //console.log(this);
//        //attrs.password = bcrypt.hashSync(attrs.password);
//        next();
//
//    }

};

