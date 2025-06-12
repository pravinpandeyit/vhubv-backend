function ApiError(res, statusCode, message, data) {
    var status = Boolean;
    var apiStatusCode = 200;
    if (statusCode == 200) {
      status = true;
  
      //statusCode 200
    } else {
      status = false;
    }
    //statusCode = 200;
    return res.status(apiStatusCode).send({
      status: status,
      statusCode: statusCode,
      message: message,
      data: data,
    });
  }

module.exports = { ApiError };
