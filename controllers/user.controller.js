const debug = require('debug');
const LOG = debug('chat:');
const User = require('../models/user.model');

module.exports = {
    /**
     * GET /login
     * Render an HTML UI where a user enter the credential to login
     */
    login: (req, res) => {
        LOG(`${req.method} ${req.url}`);
        res.render('index');
    },
    /**
     * GET /signup
     * Render an HTML interface where a user will enter their credentials: email, username and password
     * @param request 
     * @param response
     */
    signup: (request, response) => {
        LOG(`${request.method} ${request.url}`);
        response.render('signup');
    },
    /**
     * 
     */
    login_post: (request, response) => {
        LOG(`${request.method} ${request.url}`);
        
        response.json();
    },
    /**
     * POST /register
     * 
     * Register a user.
     * Save this user to the database, validate his/her email and username to be unique
     * @param request 
     * @param response
     * @return a JSON object. { status: number, message: string}
     */
    signup_post: async (request, response) => {
        LOG(`${request.method} ${request.url}`);
        // console.log(`This is the body: ${request.body}`);
        const { username, email, password } = request.body;
        console.log(`Signup: ${username}, ${email}, ${password}`);
        try {
            const user = new User({ username, email, password });
            const userSaved = await user.save();
        }
        catch( err ){
            console.log(`Error Saving into the database a user: ${user.username}`);
        }
        
        const result = {
            status: 200,
            message: 'user saved succesfully'
        };
        response.json(result);
    }
}