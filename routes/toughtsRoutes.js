const express = require('express');
const router = express.Router();
const ToughtsController = require('../controllers/ToughtsController');

// Helpers
const checkAuth = require('../helpers/auth').checkAuth;

// controler
router.get('/dashboard', checkAuth, ToughtsController.dashboard);
router.get('/add', checkAuth, ToughtsController.createTought);
router.post('/add', checkAuth, ToughtsController.createToughtSave);

// Edite Rotes
router.get('/edit/:id', checkAuth, ToughtsController.updateTought);
router.post('/edit', checkAuth, ToughtsController.updateToughtSave);

// Remove Rotes
router.post('/remove', checkAuth, ToughtsController.removeTought);

router.get('/', ToughtsController.showToughts);

module.exports = router;
