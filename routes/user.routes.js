const UserController  = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/login', UserController.login);
router.get('/signup', UserController.signup);
router.post('/register', UserController.signup_post);
router.post('/validate', UserController.login_post);

module.exports = router;
