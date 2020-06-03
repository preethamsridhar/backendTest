'use strict';
const http = require('http');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const log = require('./services/logger');
const routeService = require('./Routes');
const {port} = require('./config');
/********************************
 * LOAD SERVER EXPRESS SERVER
 ********************************/
class Server {
	constructor() {
		//Intializing Express Function
		this._app = express();
		this._initializeApp();
		this._server = new http.createServer(this._app);
	}

	_initializeApp() {
		this._loadBodyParser();
		this._loadMorgan();
	}

	_loadBodyParser() {
		//Handling Body Parser for parsing Incoming Data request
		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({
			extended: true
		}));
	}

	_loadMorgan(){
		this._app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: log.stream }));
	}
	_loadRoutes() {
		//load Route services
		this._app.use(routeService);
	}
	start() {
		//Start Express Server
		return Promise.resolve()
			.then(()=>{
				this._loadRoutes();
			})
			.then(()=>{
				return new Promise((resolve,reject) => {
					this._server.listen(port,'127.0.0.1',(err)=>{
						if(err) {
							reject(err);
						}
						else {
							resolve();
						}
					});
					this._server.on('error', this._onError = this._onError.bind(this));
					this._server.on('listening', this._onListening = this._onListening.bind(this));
				});
			})
			.catch((error)=>{
				this._onError(error);
				return Promise.reject(error);
			});
	}
	_onError(error) {
		console.log(error);
		log.error('failed to start API server with error::',error);
	}
	_onListening() {
		const addressInfo = this._server.address();
		console.log(`API server listening on Address: ${addressInfo.address} and port : ${addressInfo.port}`);
	}
}

module.exports = Server;