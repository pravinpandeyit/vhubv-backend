module.exports = (sequelize, Sequelize) => {
    const workspaceDayPass = sequelize.define("workspace_day_pass", {
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
        price_per_day: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        credits_required: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        opens_at: {
            type: Sequelize.TIME,
            allowNull: false,
        },
        closes_at: {
            type: Sequelize.TIME,
            allowNull: false,
        },
        is_open_now: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        is_open_early: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        is_close_late: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        space_type: {
            type: Sequelize.STRING,

            allowNull: false,
        },
        fnb_discount: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        popularity_score: {
            type: Sequelize.INTEGER,
            allowNull: false,
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

    return workspaceDayPass;
};
