const Router = require('express');
const friendshipController = require('../controllers/friendshipController');
const router = new Router();

router.get('/getAllFriends', friendshipController.getAllFriends);
router.get('/getAllNotifications', friendshipController.getAllNotifications);
router.get('/getAllSubscribers', friendshipController.getAllSubscribers);
router.post('/sendFriendRequest', friendshipController.sendFriendRequest);
router.put('/acceptFriendRequest', friendshipController.acceptFriendRequest);
router.put('/rejectFriendRequest', friendshipController.rejectFriendRequest);
router.delete('/deleteFriend', friendshipController.deleteFriend);
router.delete('/deleteFriendRequest', friendshipController.deleteFriendRequest);

module.exports = router;