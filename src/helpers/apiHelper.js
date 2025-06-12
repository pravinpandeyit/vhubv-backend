const dbConfig = require("../config/db.config");
const {
  Sequelize,
  DataTypes
} = require('sequelize');
const bcrypt = require('bcrypt');





//==========For Get Pagination==========
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return {
    limit,
    offset
  };
};

//==========For Get Pagination Data==========
const getPagingData = (data, page, limit) => {
  const {
    count: totalItems,
    rows: result
  } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage,
    result
  };
};

//==========Sequelize Config==========
const getSequelize = () => {
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    // operatorsAliases: false,
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
  return sequelize;
}

// campare password
const comparePasswords = async (plainPassword, hashedPassword) => {
  console.log(plainPassword, hashedPassword);
  
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Helper function to calculate account age
const calculateAccountAge = (created_date) => {
  if (!created_date || isNaN(new Date(created_date).getTime())) {
      return 'Invalid Date'; 
  }
  const createdDate = new Date(created_date);
  const currentDate = new Date();

  const diffTime = currentDate - createdDate; 
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

  const diffYears = currentDate.getFullYear() - createdDate.getFullYear();
  const diffMonths = currentDate.getMonth() - createdDate.getMonth() 
                     + (diffYears * 12); 

  if (diffYears > 0) {
      return `${diffYears} Years`;
  } else if (diffMonths > 1) {
      return `${diffMonths} Months`;
  } else {
      return `${diffDays} Days`;
  }
}

const calculateAccountAgeInMinute = (created_date) => {
  if (!created_date || isNaN(new Date(created_date).getTime())) {
      return 'Invalid Date'; 
  }
  const createdDate = new Date(created_date);
  const currentDate = new Date();
  const diffTime = currentDate - createdDate;
  const diffYears = currentDate.getFullYear() - createdDate.getFullYear();
  const diffMonths = (currentDate.getMonth() - createdDate.getMonth()) + (diffYears * 12);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffYears > 0) {
      return `${diffYears} Years`;
  } else if (diffMonths > 0) {
      return `${diffMonths} Months`;
  } else if (diffDays > 0) {
      return `${diffDays} Day(s)`;
  } else if (diffHours > 0) {
      return `${diffHours} Hours`;
  } else {
      return `${diffMinutes} Minutes`;
  }
};


// views formate
const formatViews = (count) => {
  if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'; 
  } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k'; 
  } else {
      return count; 
  }
}

const formatTimeToAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes; 

  const formattedTime = hours + ':' + minutes + ' ' + ampm;
  return formattedTime;
}

const formatDateTime = () => {
  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
  }).replace(",", "");
  return formattedDate;
}

//===========Here All Function Exports =============
module.exports = {
  formatDateTime,
  getPagingData,
  getPagination,
  getSequelize,
  comparePasswords,
  calculateAccountAge,
  formatViews,
  calculateAccountAgeInMinute,
  formatTimeToAMPM
};