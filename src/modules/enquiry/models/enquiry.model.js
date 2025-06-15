module.exports = (sequelize, Sequelize) => {
  const Enquiry = sequelize.define("enquiry", {
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    is_seen: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Enquiry;
};
