require('dotenv').config();
const db = require('./models');

db.sequelize
  .sync({ force: true }) // WARNING: drops and recreates tables
  .then(() => {
    console.log('Database synced successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    process.exit(1);
  });