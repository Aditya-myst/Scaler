'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

let config;
try {
  config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
  console.log('Config loaded for environment:', env);
  console.log('Database:', config.database);
  console.log('Host:', config.host);
} catch (error) {
  console.error('Error loading config:', error.message);
  process.exit(1);
}

const db = {};

// ✅ Pass full config including dialectOptions for SSL
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions || {}  // ✅ this was missing
  }
);

console.log('Sequelize instance created');

const modelFiles = fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

console.log('Model files found:', modelFiles);

modelFiles.forEach((file) => {
  try {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    console.log(`Model loaded: ${model.name} from ${file}`);
  } catch (error) {
    console.error(`Error loading model ${file}:`, error.message);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`Associations set for: ${modelName}`);
    } catch (error) {
      console.error(`Error setting associations for ${modelName}:`, error.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;