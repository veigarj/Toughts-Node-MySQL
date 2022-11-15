const expres = require('express');
const router = expres.Router();
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);
router.post('/register', AuthController.registerPost);

module.exports = router;
