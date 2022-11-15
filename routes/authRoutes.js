const expres = require('express');
const router = expres.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);

module.exports = router;
