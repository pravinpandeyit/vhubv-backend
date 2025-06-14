const express           = require("express");
const bodyParser        = require("body-parser");
const cors              = require("cors");
const app               = express();
const db                = require("./src/modules/model.index");
const seeder            = require("./src/seeders");
// const { port,databaseMigration }          = require('./src/config/env.config');
var path = require('path');
const multer = require('multer');
// const { ApiError } = require("./src/utils/ApiError");
// const cron = require("node-cron");


var corsOptions = {
  origin: "*"
};

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(cors(corsOptions));


// // *For Db Migration */
// if(databaseMigration=="Yes"){
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  //   seeder.UserSeederFn()
  //   seeder.CategorySeederFn()
  //   seeder.PropertySeederFn()
  // });
// }

// const upload = multer();
// app.use(upload.array());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Care Exchange" });
});

app.use('/public', express.static('public'));


require('./src/modules/route.index')(app);

app.use((err, req, res, next) => {
  if (err.status === 413) {
    return ApiError(res, 413, `Payload too large. Please upload a smaller file.`);
  }
  next(err);
});
app.use((err, req, res, next) => {
  if (err) {
      return res.status(err.statusCode || 500).json({
          status: err.status || false,
          statusCode: err.statusCode || 500,
          message: err.message || 'Internal Server Error',
      });
  }
  next();
});

let port = 3000
const PORT = port || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});