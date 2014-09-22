/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function(req, res) {
//http://localhost:1337/post/create?topic_id=DDD&msg=vasa_good

        var msg = req.param('msg');
        var topicId = req.param('topic_id');
        var newPost = {
            creator_id_post: req.session.user.id,
            topic_id: topicId,
            msg: msg,
            like: 0
        };
        Post.create(newPost).exec(function create(err, created) {
            if (err) {
                res.send({error: 'Server error', err: err}, 500);
            }
            res.send(created);
        });
    },
    view_list: function(req, res) {
        //http://localhost:1337/post/view_list?topic_id=DDD&start=1&size=3
        var topicId = req.param('topic_id');
        var start = req.param('start');
        var size = req.param('size');
        //{user_id: 1, topic_name: 1}
        Post.find({topic_id: topicId}).limit(size).skip(start).exec(function(err, posts) {
            if (err) {
                res.send({error: 'Server error', err: err}, 500);
            } else {
                res.send(posts);
            }
        });
    },
    delet: function(req, res) {
        //http://localhost:1337/post/delet?post_id=
        var userId = req.session.user.id;
        var postId = req.param('post_id');
        Post.destroy({"id": postId, 'creator_id_post': userId}).exec(function(err, rez) {
            if (err) {
                res.send({error: 'Server error', err: err}, 500);
            }
            res.send(rez);
        });
    },
    likes: function(req, res) {
        //http://localhost:1337/post/likes?post_id=
        var userId = req.session.user.id;
        var postId = req.param('post_id');
         
        ///, "creator_id_post": userId id: postId
        //{$set: {name: 'Roooooodles', dob: new Date(1979, 7, 18, 18, 44), loves: ['apple'], gender: 'm', vampires: 99}}

        //        Post.update({id: postId}, {$set: {$inc: {"like": 1}}}).exec(function(err, rez) {
        //            if (err) {
        //                res.send({error: 'Server error', err: err}, 500);
        //            }
        //            res.send(rez);
        //        });

        Post.findOne({id: postId, "creator_id_post": userId}).exec(function(err, post) {
            if (err) {
                res.send({error: 'Server error', err: err}, 500);
            } 
            post.like = post.like + 1;
            post.save(function(err, rez) {

                if (err) {
                    res.send({error: 'Server error', err: err}, 500);
                } else {
                    res.send(rez);
                }
            });
        }); 
    }
};

