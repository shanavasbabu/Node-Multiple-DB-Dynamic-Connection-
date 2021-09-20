var express = require("express");
var app = express();
var router = express.Router();
var config = require("./config/config");
const dboperations = require("./dbOperation");
var sql = require("mssql");
var sqlDyn = require("mssql");
var bodyParser = require("body-parser");
var cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);
const dynamicConfig = require("./config/dynamic-config");

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

// Get All Data
router.route("/orders").get((request, response) => {
  dboperations.getOrders().then((result) => {
    // console.log(result);
    response.json(result);
  });
});

//Particualr Token DB Verify

router.route("/Config").post(async (request, response) => {
  var token = request.body.token_uniq;
  var query = request.body.query;
  var databseDetails = "";
  sql.connect(config.getConnection(), function (err) {
    if (err) console.log(err);
    var request = new sql.Request();
    request.query(
      `select * from configDetails WHERE [token_uniq]= '${token}'`,
      function (err, result) {
        if (err) console.log(err);
        // console.log(result);
        sql.close(); 
         databseDetails = result.recordset;

        // Dynamic DB Configuration
         sqlDyn.connect(dynamicConfig.getConnection(databseDetails), function (err) {
          if (err) console.log(err);
          var dyrequest = new sqlDyn.Request();console.log(dyrequest);
          dyrequest.query("select * from demoDetails", function (errr, results) {
            if (errr) response.json(errr);
            //  console.log(result);
            response.json(results);
          });
        });
      }
    );
  });
});

// Database login
router.route("/dbLoginDetails").get((req, res) => {
  dboperations
    .dbConnectData()
    .then((result) => {
      // console.log(result);
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Insert Db Details
router.route("/dbInsertDetails").post((request, response) => {
  let details = { ...request.body };
  console.log(details.id);
  console.log(details.user);
  const payload = { name: details.user };
  const options = { expiresIn: "1s", issuer: "https://scotch.io" };
  const secret = "MyToken";
  let token = jwt.sign(payload, secret, options);
  sql.connect(config.getConnection(), function (err) {
    var request = new sql.Request();
    // console.log(`INSERT INTO configDetails ([id], [user], [password], [server],[database],[token_uniq]) VALUES(${details.id},'${details.user}','${details.password}','${details.server}','${details.database}','${token}')`);
    request.query(
      `INSERT INTO configDetails ([id], [user], [password], [server],[database],[token_uniq]) VALUES(${details.id},'${details.user}','${details.password}','${details.server}','${details.database}','${token}')`,
      function (error, result, fields) {
        // console.log(result);
        // response.send(result);
        response.status(201).json({ result, token: token, name: details.user });
      }
    );
  });
});

// Listen Port
app.listen(5000, function () {
  console.log("Server is running..");
});
