const debug = require('debug');
const moment =  require('moment');
const bcrypt = require('bcrypt');
const LOG = debug('chat:');
const User = require('../models/user.model');
const helper = require('../helpers/user.helper');

module.exports = {
    logout: (request, response) => {
        request.session.destroy();
        response.redirect('/login');
    },
    /**
     * GET /login
     * Render an HTML UI where a user enter the credential to login
     */
    login: (req, res) => {
        LOG(`${req.method} ${req.url}`);
        if(req.session.userId)// there is a session currently
        {
            res.redirect('/chat');
        }
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
     * POST /validate
     * Validate the user if is registered in the database.
     * @param request
     * @param response
     * @return a json objet { status: number, message: string }
     */
    validate: (request, response) => {
        LOG(`${request.method} ${request.url}`);
        const {username, password } = request.body;
        const result = {
            status: 200,
            message: 'User found'
        };
        LOG(`Username: ${username}`);
        User.findOne({username})
        .then( user => {
            if(user == null)
            {
                result.message = 'User NOT Found in database';
                result.status = 200;
                return response.status(result.status).json(result);
            }
            bcrypt.compare(password, user.password).then(match => {
                if(!match){
                    result.status = 200;
                    result.message = "Password doesn't match";
                    return response.status(result.status).json(result);
                }
                LOG(`User found ${user.email}`);
                result.message = 'User Authenticated';
                result.status = 200;
                request.session.user = user;
                request.session.userId = user.id;
                return response.status(result.status).json(result);
            }).catch(err => {
                result.status = 500;
                result.message = `Error comparing hash password ${err}`;
                return response.status(result.status).json(result);
            });
        }).catch( error => {
            LOG(`Error ${error}`);
            result.message = `Error login user: ${error}`;
            result.status = 504;
            return response.status(result.status).json(result);
        });
    },
    /**
     * POST /register
     * 
     * Register a user.
     * Save this user to the database, validate his/her email and username to be unique.
     * JSON data request {username, email, password}. It will save a date value as default when used is saved
     * @param request 
     * @param response
     * @return a JSON object. { status: number, message: string}
     */
    register: (request, response) => {
        LOG(`${request.method} ${request.url}`);
        // console.log(`This is the body: ${request.body}`);
        const { username, email, password } = request.body;
        // console.log(`Signup: ${username}, ${email}, ${password}`);
        const result = {
            status: 200,
            message: 'User registered succesfully',
            id: '',
            token: ''
        };
        // validate the user if is currently registered in the database
        helper.isUserRegistered(username)
        .then( found => {
            if( !found ) // save a new user in the database if it does not exist
            {
                LOG('User not found');
                bcrypt.hash(password, 10).then(hash => {
                    const user = new User({ username, email, password: hash });
                    user.save()
                    .then(userSaved => {
                        result.status = 200;
                        result.message = `User saved: ${email} at ${userSaved.created_at}`;
                        return response.status(result.status).json(result);
                    })
                    .catch( err => {
                        result.status = 501;
                        result.message = `Error saving user: ${email} - ${err}`;
                        return response.status(result.status).json(result);
                    });
                }).catch( err => {
                    result.status = 502;
                    result.message = `Error creating Hash - ${err}`;
                    return response.status(result.status).json(result);
                });
            }
            else
            {
                LOG('User Found!!');
                result.message = `User (${username}) already registered!. Forgot your password?`;
                return response.status(200).json(result);
            }
        })
        .catch( error => {
            result.message = `Something went wrong : ${error}`;
            result.status = 503;
            LOG(`Error ${error}`);
            return response.status(result.status).json(result);
        });
    }
}