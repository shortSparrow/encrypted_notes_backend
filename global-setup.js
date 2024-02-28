const { initDb, dbClient } = require("./src/database/database")

module.exports = async () => {
  console.log("START INIT DB FOR TESTS: ", dbClient.database)
  await initDb()
  console.log("END INIT DB FOR TESTS: ", dbClient.database)
}
