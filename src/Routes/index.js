const Router = require('express').Router();
const login = require('../controller/login');
const authenticate = require('../services/middleware/authenticate');
const protect = require('../controller/protected');
	
Router.post('/login',login);

Router.use('/',authenticate);

Router.post('/jsonPatch',protect.jsonPatch);
Router.post('/thumbnail',protect.thumbNail);
	
module.exports = Router;