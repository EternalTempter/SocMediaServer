const Router = require('express');
const inboxController = require('../controllers/inboxController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/get', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, inboxController.get);
router.get('/getInbox', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, inboxController.getInbox);
router.post('/create', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, inboxController.create);
router.put('/updateLastMessage', AuthMiddleware, RateLimitMiddleware.MessageLimiter, inboxController.updateLastMessage);
router.put('/updateLastMessageView', AuthMiddleware, RateLimitMiddleware.MessageLimiter, inboxController.updateLastMessageView);

module.exports = router;