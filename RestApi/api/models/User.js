/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        email: {
            type: 'string',
            unique: true,
            required: true
        },
        password: {
            type: 'string',
            required: true,
            minLength: 4
        }
    },
    beforeCreate: function(attrs, next) {
        var bcrypt = require('bcrypt-nodejs');

        attrs.password = bcrypt.hashSync(attrs.password);
        next();

    }
};

