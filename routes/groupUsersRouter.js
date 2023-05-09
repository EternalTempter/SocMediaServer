const Router = require('express');
const groupUsersController = require('../controllers/groupUsersController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getAllSubscribers', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.getAllSubscribers);
router.get('/subscribe', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.subscribe);
router.get('/getUserGroupSubsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.getUserGroupSubsCount);
router.get('/getGroupSubsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.getGroupSubsCount);
router.get('/getFirstGroupSubs', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.getFirstGroupSubs);
router.get('/getGroupUser', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.getGroupUser);
router.delete('/unsubscribe', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupUsersController.unsubscribe)

module.exports = router;