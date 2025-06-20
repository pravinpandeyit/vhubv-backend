module.exports = (sequelize, Sequelize) => {
  const WorkspaceProperty = sequelize.define("workspace_property", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subcategoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brand: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    product_types: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    inventory_type: {
      type: Sequelize.STRING, // Warm Shell, Ready to move-in
      allowNull: false,
    },
    type_of_establishment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name_of_establishment: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ownership_of_property: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    complete_address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    working_days: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    opening_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    internet_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    center_type: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    num_of_seats_available_for_coworking: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    area_in_sqft: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    cabins: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    current_occupancy_percentage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // pictures_of_the_space: {
    //   type: Sequelize.ARRAY(Sequelize.STRING),
    //   allowNull: true,
    // },
    parking: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    metro_connectivity: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_popular: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    min_lock_in_months: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    furnishing: {
      type: Sequelize.STRING, // 'Furnished' or 'Unfurnished'
      allowNull: true,
    },
    developer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    building_grade: {
      type: Sequelize.STRING, // 'A', 'B', 'C'
      allowNull: true,
    },
    year_built: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    solutions: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  });

  return WorkspaceProperty;
};
