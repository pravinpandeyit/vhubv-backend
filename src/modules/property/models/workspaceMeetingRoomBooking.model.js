// models/workspaceMeetingRoomBookings.js
module.exports = (sequelize, Sequelize) => {
  const workspaceMeetingRoomBookings = sequelize.define("workspace_meeting_room_bookings", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    meeting_room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    time_slot: {
      type: Sequelize.ENUM("full_day", "morning", "afternoon", "evening"),
      allowNull: false,
    },
    duration: {
      type: Sequelize.INTEGER, // in hours
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("booked", "cancelled"),
      defaultValue: "booked",
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    timestamps: false,
  });

  return workspaceMeetingRoomBookings;
};
