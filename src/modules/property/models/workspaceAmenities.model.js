module.exports = (sequelize, Sequelize) => {
  const workspaceAmenities = sequelize.define("workspace_amenities", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    amenity_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("available", "paid", "not_included", "Premier"),
      defaultValue: "available",
    },
    info: {
      type: Sequelize.STRING,
    },
    is_included: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return workspaceAmenities;
};
