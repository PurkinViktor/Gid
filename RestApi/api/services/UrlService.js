exports.createUrl = function(host, path, options) {

    options = options || {};
    var url = host + "/" + path;
    var arg = ""; 
    for (var propertic in options) {
        if (arg !== "") {
            arg +="&";
        }
        arg += propertic + "=" + options[propertic];
    }
    if (arg !== "") {
        url += "?" + arg;
    }
    return url;


};