module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    parentId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "categories", // Reference the `categories` table for parentId
        key: "id",
      },
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 1, // 1 for active, 0 for inactive
    },
  });

  return Category;
};
