/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        creator_id_post: {
            type: 'integer'
        },
        post_id:{
            type: 'integer'
        },
        msg: {
            type: 'string'
        },
        like: {
            type: 'integer'
        }
    }
};

