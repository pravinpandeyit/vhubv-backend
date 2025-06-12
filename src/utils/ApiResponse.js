function ApiResponse(res, statusCode, message, data) {
  console.log(res, statusCode, message, data);
  
    var status = Boolean;
    var apiStatusCode = 200;
    return res.status(apiStatusCode).send({
      status: true,
      statusCode: statusCode,
      message: message,
      data: data,
    });
  }

module.exports =  { ApiResponse }