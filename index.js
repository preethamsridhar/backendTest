require('dotenv').config();
require('express-async-errors');
const server = require('./src/server');
const log = require('./src/services/logger');

/*************************************************************************************/
/* START PROCESS UNHANDLED METHODS */
/*************************************************************************************/
process.on('unhandledRejection', (reason, p) => {
	log.error('Unhandled Rejection at:', p, 'reason:', reason);
	log.error('API server exiting due to unhandledRejection...');
	process.exit(1);
});
process.on('uncaughtException', (err) => {
	log.error('Uncaught Exception:', err);
	log.error('API server exiting due to uncaughtException...');
	process.exit(1);
});
/*************************************************************************************/
/* END PROCESS UNHANDLED METHODS */
/*************************************************************************************/

/**
 * START THE SERVER
 */
const appServer = new server();
appServer.start();

/**
 *  CLEANUP BEFORE SERVER TERMINATION
 */
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
sigs.forEach(sig => {
	process.on(sig, shutdown);

    function shutdown(){
        appServer._server.close((err) => {          // here server is closed, so that it will not accept new requests
            log.info(`${sig} signal received. Server Terminated`);
            closeDbConnection();
            process.exit(0);               // exiting the process with status 0
        });
        setTimeout((err) => {
            log.info('Forcing server close !!!', err);
            closeDbConnection()
            process.exit(1)
          }, 5000)
    }
});

module.exports = appServer._app; // for testing