module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    userid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, 
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    user_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    device_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
     otp: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });
  return User;
};
