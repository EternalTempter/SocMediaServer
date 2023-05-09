const Router = require('express');
const messagesController = require('../controllers/messagesController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.post('/create', AuthMiddleware, RateLimitMiddleware.MessageLimiter, messagesController.create);
router.get('/getAll', AuthMiddleware, RateLimitMiddleware.MessageLimiter, messagesController.getAll)
router.get('/getMessagesCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, messagesController.getMessagesCount)
router.get('/findMessages', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, messagesController.findMessages)
router.get('/getAllUserMessagesCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, messagesController.getAllUserMessagesCount)
router.get('/checkForNewMessages', AuthMiddleware, RateLimitMiddleware.MessageLimiter, messagesController.checkForNewMessages)
router.put('/updateMessage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, messagesController.updateMessage)
router.put('/updateView', AuthMiddleware, RateLimitMiddleware.MessageLimiter, messagesController.updateView)
router.delete('/deleteMessage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, messagesController.deleteMessage)
  
module.exports = router;