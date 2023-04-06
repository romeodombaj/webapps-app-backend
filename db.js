const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(
      "mongodb+srv://romeodombaj:VFPds2H4uqDNwZPV@web-apps.rynwuoe.mongodb.net/cooknrate?retryWrites=true&w=majority"
    )
      .then((client) => {
        dbConnection = client.db();
        console.log("Connected to db");
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
