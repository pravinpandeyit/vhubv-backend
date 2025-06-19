module.exports = (sequelize, Sequelize) => {
    const workspaceMeetingEquipment = sequelize.define("workspace_meeting_equipment", {
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
        monitor_tv_projector: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        speakers: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        video_conference: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        whiteboard: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    });

    return workspaceMeetingEquipment;
};
