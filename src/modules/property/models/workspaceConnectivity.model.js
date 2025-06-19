module.exports = (sequelize, Sequelize) => {
  const workspaceConnectivity = sequelize.define("workspace_connectivity", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    station_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    metro_line: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    distance_in_meters: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return workspaceConnectivity;
};
