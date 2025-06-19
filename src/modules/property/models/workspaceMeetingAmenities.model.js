module.exports = (sequelize, Sequelize) => {
    const workspaceMetingAmenities = sequelize.define("workspace_meeting_amenities", {
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
        beverages: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        electricity: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        stationery: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    });

    return workspaceMetingAmenities;
};
