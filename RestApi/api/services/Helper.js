
exports.getExtFile = function(fileName) {

    var parts, ext = (parts = fileName.split("/").pop().split(".")).length > 1 ? parts.pop() : "";
    return ext;

};


