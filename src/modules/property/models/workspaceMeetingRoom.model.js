module.exports = (sequelize, Sequelize) => {
    const workspaceMeetingRoom = sequelize.define("workspace_meeting_room", {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        workspace_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        price_per_hour: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        credits_required: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        capacity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        room_type: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        is_instant_confirmation: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        popularity_score: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        distance_from_center_km: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    });

    return workspaceMeetingRoom;
};
