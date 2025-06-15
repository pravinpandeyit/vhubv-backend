const envConfig = require("../config/env.config");
const auth = require("./auth/routes/auth.route");
const property = require("./property/routes/property.route");
const category = require("./property/routes/category.route");
const enquiry = require("./enquiry/routes/enquiry.route");
const requirement = require("./requirement/routes/requirement.route");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.use(envConfig.BASE_URL, auth);
  app.use(envConfig.BASE_URL, property);
  app.use(envConfig.BASE_URL, category);
  app.use(envConfig.BASE_URL, enquiry);
  app.use(envConfig.BASE_URL, requirement);
};
