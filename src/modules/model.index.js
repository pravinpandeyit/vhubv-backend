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
db.workspaceProperty = require("./property/models/WorkspaceProperty.model")(sequelize, Sequelize);
db.spaceCategories = require("./property/models/spaceCateogories.model")(sequelize, Sequelize);
db.enquiries = require("./enquiry/models/enquiry.model")(sequelize, Sequelize);
db.requirements = require("./requirement/models/requirement.model")(sequelize, Sequelize);
db.workspaceDayPass     = require("./property/models/workspaceDayPass.model")(sequelize, Sequelize);
db.workspaceMeetingRoom     = require("./property/models/workspaceMeetingRoom.model")(sequelize, Sequelize);
db.workspaceMeetingEquipment     = require("./property/models/workspaceMeetingEquipment.model")(sequelize, Sequelize);
db.workspaceMetingAmenities     = require("./property/models/workspaceMeetingAmenities.model")(sequelize, Sequelize);
db.workspaceMeetingRoomBookings     = require("./property/models/workspaceMeetingRoomBooking.model")(sequelize, Sequelize);
db.workspaceDayPassTiming     = require("./property/models/workspaceDayPassTiming.model")(sequelize, Sequelize);
db.workspaceConnectivity     = require("./property/models/workspaceConnectivity.model")(sequelize, Sequelize);
db.amenitiesMaster     = require("./property/models/amenitiesMaster.model")(sequelize, Sequelize);
db.workspaceAmenities     = require("./property/models/workspaceAmenities.model")(sequelize, Sequelize);
db.partnerSubmission     = require("./property/models/PartnerSubmission.model")(sequelize, Sequelize);

module.exports = db;
