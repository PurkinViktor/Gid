/**
 * TopicController
 *
 * @description :: Server-side logic for managing Topics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function(req, res) {
        //http://localhost:1337/topic/create?topic_name=pro_vasa

        var topicName = req.param('topic_name');
        var newTopic = {
            user_id: req.session.user.id,
            topic_name: topicName
        };
        Topic.create(newTopic).exec(function create(err, created) {
            if (err) {
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
            }
            res.send(created);
        });
    },
    delet: function(req, res) {
        //http://localhost:1337/topic/delet?topic_id=
        var userId = req.session.user.id;
        var topicId = req.param('topic_id');
        Topic.destroy({"id": topicId, 'user_id': userId}).exec(function(err, rez) {
            if (err) {
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err}, 500);
            }
            res.send({error_code: ErrorCode.Code.NO_ERR, status: Status.Code.OK});
        });
    },
    view_list: function(req, res) {
        //http://localhost:1337/topic/view_list?start=1&size=3
        var start = req.param('start');
        var size = req.param('size');
        //{user_id: 1, topic_name: 1}
        Topic.find().limit(size).skip(start).exec(function(err, topics) {
            if (err) {
                res.send({error_code: ErrorCode.Code.SERVER_ERR, err: err},500);
            } else {
                res.send(topics);
            }
        });
    }
};

