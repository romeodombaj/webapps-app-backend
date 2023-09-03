const { MongoClient } = require("mongodb");
let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(
      "mongodb+srv://romeodombaj:a9qQ0vfy8PCkCkoG@wepapps.nlvcnjb.mongodb.net/cooknrate?retryWrites=true&w=majority"
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
