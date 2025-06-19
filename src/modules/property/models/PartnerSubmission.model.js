module.exports = (sequelize, Sequelize) => {
  const PartnerSubmission = sequelize.define("partner_submission", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
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
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alternate_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER, // 0=pending, 1=approved, 2=rejected
      defaultValue: 0,
    },
  });

  return PartnerSubmission;
};
