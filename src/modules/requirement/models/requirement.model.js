module.exports = (sequelize, Sequelize) => {
  const Requirement = sequelize.define("requirement", {
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
    interested_in: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    company_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    team_size: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    is_seen: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return Requirement;
};
