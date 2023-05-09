const Router = require('express');
const newsController = require('../controllers/newsController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getAll', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, newsController.getAll);
router.post('/create', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, newsController.create);
router.delete('/deleteById', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, newsController.deleteById);

module.exports = router;