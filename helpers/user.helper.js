const User = require('../models/user.model');
const LOG = require('debug')('chat:helper');
const jwt = require('jsonwebtoken');


// const LOG = debug('chat:helper');

/**
 * Check if the user is already in the database. to avoid duplicates!!
 * @param {string} username 
 * @param {string} email 
 */
const isUserRegistered = async (username, email) => {
    try{
        const userFound = await User.findOne({username: username});
        LOG(`userFOund ${userFound}`);
        if( userFound != null ) {
            LOG(`User Found ${userFound.email}`);
            return true;
        }
        else {
            return false
        }
    }
    catch( error ){
        throw new Error(`Something went wrong isUserRegistered ${error}`);
    }
}
/**
 * Middleware to check if is allowed to visit a URL. Check if its token is valid.
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
const authCheck = (req, res, next) => {
    const result = {
        status: 0,
        message: ''
    };

    try {
        if (req.headers.authorization === undefined) {
            result.status = 402;
            result.message = 'Authorization header is not present in current request!';
            return res.status(402).json(result);
        }
        const token = req.headers.authorization.split(' ');
        // token must contain 2 elements after splitted. Because of the convention
        // of using 'Bearer ...' at the beggining of the token
        if (token.length <= 1) {
            result.status = 403;
            result.message = 'Token is not parsed correctly!';
            return res.status(403).json(result);
        }
        if (jwt.verify(token[1], config.getJwtPrivateKey())) {
            next();
        }
    } catch (err) {
        return res.status(401).json(
            { status: 401, message: `Token unrecognized! Unable to access to this Site. - ${err}` }
        );
    }
};
const redirectLogin = (req, res, next) => {
    if(!req.session.userId)
    {
        res.redirect('/login');
    }else{
        next();
    }
}
module.exports = {
    isUserRegistered,
    authCheck,
    redirectLogin
}