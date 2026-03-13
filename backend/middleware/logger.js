const morgan = require('morgan');

const logger = morgan('dev'); // Logs requests in the 'dev' format

module.exports = logger;