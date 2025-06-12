const jwt = require("jsonwebtoken");
const db = require("../modules/route.index");
const apiHelper = require("../helpers/apiHelper");
const envConfig = require("../config/env.config");
const User = db.users;
const { ApiError } = require('../utils/ApiError');



// Middleware to verify token
const verifyToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  if (!authHeader) {
    return ApiError(res, 403, "No token provided!",);
  }
  let token = authHeader.split(" ")[1];
  if (!token) {
    return ApiError(res, 403, "No token provided!",);
  }
  jwt.verify(token, envConfig.SECRET_JWT, (err, decoded) => {
    if (err) {
      return ApiError(res, 401, "Unauthorized!", []);
    }
    req.userId = decoded.userid;
    next();
  });
};

// Middleware to admin verify 
const isAdmin = async (req, res, next) => {
  console.log(req.userId);
  
  await User.findOne({
    where: {
      userid: req.userId
    },
  }).then(user => {
    if (user && user.user_type == 4) {
      next();
    } else {
      return ApiError(res, 403, "Only Admin Can Access!");
    }
  })
    .catch(err => {
      return ApiError(res, 403, "Error retrieving user information.", err.message);
    });
};

// Middleware to provider verify 
const isProvider = async (req, res, next) => {
  await User.findOne({
    where: {
      userid: req.userId
    },
  }).then(user => {
    if (user && (user.user_type == 2 || user.user_type == 3)) {
      next();
    } else {
      return ApiError(res, 403, "Only Provider Can Access!");
    }
  })
    .catch(err => {
      return ApiError(res, 403, "Error retrieving user information.", err.message);
    });
};




const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isProvider:isProvider
};

module.exports = authJwt;