exports.getRecoverUrl = function(options) {
    return UrlService.createUrl("http://localhost:1337", "user/recoverPage", options);
};