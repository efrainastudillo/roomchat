const UserController  = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/login', UserController.login); // UI Login
router.get('/signup', UserController.signup); // UI SignUp
router.post('/register', UserController.register); // save a user in the database
router.post('/validate', UserController.validate); // login
router.get('/logout', UserController.logout);

module.exports = router;
