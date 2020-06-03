'use strict';
const jwt = require('jsonwebtoken');
const config = require('../../config');
/*******************************************
 * SERVICE FOR HANDLING JWT TOKEN GENERATION
 *******************************************/
class JwtService {
	/**
	 * Method to Generate sign new Jwt token using Json web token
	 */
	createJwtToken(tokenData) {
		return jwt.sign(
			tokenData,
			config.jwtTokenInfo.secretKey,
			{
				algorithm: config.jwtTokenInfo.algorithm,
				expiresIn: config.jwtTokenInfo.expiresIn,
				issuer: config.jwtTokenInfo.issuer,
				audience: config.jwtTokenInfo.audience
			});
	}
}
module.exports = JwtService;