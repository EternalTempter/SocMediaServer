const Router = require('express');
const groupUsersController = require('../controllers/groupUsersController');
const router = new Router();

router.get('/getAllSubscribers', groupUsersController.getAllSubscribers);
router.get('/subscribe', groupUsersController.subscribe);
router.delete('/unsubscribe', groupUsersController.unsubscribe)

module.exports = router;