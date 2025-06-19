module.exports = (sequelize, Sequelize) => {
  const workspaceDayPassTimings = sequelize.define("workspace_day_pass_timings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    day_of_week: {
      type: Sequelize.STRING, 
      allowNull: false,
    },
    opens_at: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    closes_at: {
      type: Sequelize.TIME,
      allowNull: true,
    },
    is_closed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return workspaceDayPassTimings;
};
