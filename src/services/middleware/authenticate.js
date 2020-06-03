const jwt = require('jsonwebtoken');
const log = require('../logger');
const {jwtTokenInfo} = require('../../config');

/*********************************************
 * SERVICE FOR HANDLING TOKEN AUTHENTICATION
 *********************************************/
module.exports = (req, res, next) => {
	try {
		const token = req.header('x-auth-token');

		if (!token) return res.status(401).send({msg: 'Access denied'});
			const decoded = jwt.verify(token, jwtTokenInfo.secretKey);
			req.decodedData = decoded; 
			next();
		}
	catch (ex) {
		res.status(400).send({msg: 'Invalid token.'});
	}
};