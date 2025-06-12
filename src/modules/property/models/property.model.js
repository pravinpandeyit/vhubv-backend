// models/property.model.js
module.exports = (sequelize, Sequelize) => {
  const Property = sequelize.define("property", {
    type_of_establishment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name_of_establishment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ownership_of_property: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    complete_address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    working_days: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    opening_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    internet_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    num_of_seats_available_for_coworking: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    pictures_of_the_space: {
      type: Sequelize.ARRAY(Sequelize.STRING), 
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0, // 0 for pending 1 for active 2 for in active 
    },
  });
  return Property;
};
