const Router = require('express');
const friendshipController = require('../controllers/friendshipController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getAllFriends', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.getAllFriends);
router.get('/getAllNotifications', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.getAllNotifications);
router.get('/getAllSubscribers', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.getAllSubscribers);
router.get('/getUserSubscribersCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.getUserSubscribersCount);
router.get('/getUserFriendsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.getUserFriendsCount);
router.post('/sendFriendRequest', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.sendFriendRequest);
router.put('/acceptFriendRequest', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.acceptFriendRequest);
router.put('/rejectFriendRequest', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.rejectFriendRequest);
router.delete('/deleteFriend', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.deleteFriend);
router.delete('/deleteFriendRequest', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, friendshipController.deleteFriendRequest);

module.exports = router;