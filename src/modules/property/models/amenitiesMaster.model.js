module.exports = (sequelize, Sequelize) => {
  const amenitiesMaster = sequelize.define("amenities_master", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: Sequelize.STRING, // e.g. 'wifi', 'printer'
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING, // e.g. 'Wifi', 'Printer'
    },
    category: {
      type: Sequelize.ENUM("common", "premier"),
      defaultValue: "common",
    },
  });

  return amenitiesMaster;
};
