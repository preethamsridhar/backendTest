const {
	transports,
	createLogger,
	format
  } = require('winston');
  require('winston-daily-rotate-file');
  
  const myFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level.toUpperCase()}: ${message}`;
  });
  const logger = createLogger({
	format: format.combine(
	  format.timestamp(),
	  myFormat,
	  format.colorize()
	),
	exceptionHandlers: [
	  new transports.DailyRotateFile({
		filename: 'logs/exception/%DATE%.log'
	  })
	],
	transports: [
	  new transports.DailyRotateFile({
		filename: 'logs/info/%DATE%.log',
		level: 'info',
		timestamp: true
	  })
	],
	  exitOnError: false
  });
  
  logger.stream = {
	write: function(message) {
	  // use the 'info' log level so the output will be picked up by both transports (file and console)
	  logger.info(message);
	},
  };
  
  if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console())
  }
  module.exports = logger;