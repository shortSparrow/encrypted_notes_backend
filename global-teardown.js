const { dbClient } = require('./src/database/database');

module.exports = async () => {
  console.log('DISCONNECT DB FOR TESTS: ', )
  await dbClient.end();
};