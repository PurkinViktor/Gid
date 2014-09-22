module.exports = function(req, res, next) {
    if ("user" in req.session && req.session.user !== null && req.session.user !== undefined ) {
        return next();
    } else {
        return res.json({error: 'Please log in'}, 400);
    }
};