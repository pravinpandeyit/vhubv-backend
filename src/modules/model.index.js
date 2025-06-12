const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: dbConfig.logging,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Avoid circular dependency by using function calls
db.users = require("./user/models/user.model")(sequelize, Sequelize);
db.property = require("./property/models/property.model")(sequelize, Sequelize);

module.exports = db;
