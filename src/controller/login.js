const log = require('../services/logger');
const jwtService = require('../services/jwt');

/**
 * Method to generate jwt token
 */
let _generateUserToken = (tokenData) => {
	//create a new instance for jwt service
	let tokenService = new jwtService();
	let token = tokenService.createJwtToken(tokenData);
	return token;
};

module.exports = (req,res) => {
	let responseData = {};
	try {
        log.info('Recieved request for User Login:',req.body);
		let reqEmail = req.body.user_email;
        let reqPassword = req.body.user_password;

        if(!reqEmail||!reqPassword){
            return res.status(400).send({
                success:false,
                msg:"Insufficient data"
            })
        }   
		//patch token data obj
		let tokenData = {
			user_email : reqEmail
		};
		//generate jwt token with the token obj
		let jwtToken  = _generateUserToken(tokenData);
        log.info('User login found');
		
		responseData.success = true;
		responseData.data = { authToken : jwtToken };
		return res.status(200).send(responseData);
	}
	catch(error) {
		log.error('failed to get user login with error::',error);
		responseData.success = false;
		responseData.msg = 'failed to get user login';
		return res.status(400).send(responseData);
	}
}