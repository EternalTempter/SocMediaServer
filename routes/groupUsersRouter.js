const Router = require('express');
const groupUsersController = require('../controllers/groupUsersController');
const router = new Router();

router.get('/getAllSubscribers', groupUsersController.getAllSubscribers);
router.get('/subscribe', groupUsersController.subscribe);
router.get('/getUserGroupSubsCount', groupUsersController.getUserGroupSubsCount);
router.get('/getGroupSubsCount', groupUsersController.getGroupSubsCount);
router.get('/getFirstGroupSubs', groupUsersController.getFirstGroupSubs);
router.get('/getGroupUser', groupUsersController.getGroupUser);
router.delete('/unsubscribe', groupUsersController.unsubscribe)

module.exports = router;