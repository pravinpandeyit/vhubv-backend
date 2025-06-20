// const envConfig = require("./env.config");

// module.exports = {
//   HOST: envConfig.databaseHost,
//   USER: envConfig.databaseUser,             
//   PASSWORD: envConfig.databasePass,      
//   DB: envConfig.databaseName,            
//   dialect: "postgres",         
//   port: envConfig.databasePort,                    
//   schema:'public',        
//   pool: {
//     max: 10,                   
//     min: 0,                      
//     acquire: 30000,           
//     idle: 10000,                 
//   },
//   logging: false,              
// };

const envConfig = require("./env.config");
console.log({
  HOST: envConfig.databaseHost,    
  USER: envConfig.databaseUser,     
  PASSWORD: envConfig.databasePass, 
  DB: envConfig.databaseName,      
  dialect: "mysql",                 
  port: envConfig.databasePort || 3306,});

module.exports = {
  HOST: envConfig.databaseHost,    
  USER: envConfig.databaseUser,     
  PASSWORD: envConfig.databasePass, 
  DB: envConfig.databaseName,      
  dialect: "mysql",                 
  port: envConfig.databasePort || 3306,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
};
