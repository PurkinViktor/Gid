exports.getErr = function(codeErr, err) {

    return {error_code: codeErr, err: err};
    
};
exports.getStatus = function(statusCode) {

    return {error_code: ErrorCode.Code.NO_ERR, status: statusCode};
    
};