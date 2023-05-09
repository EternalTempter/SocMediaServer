const Router = require('express');
const reportController = require('../controllers/reportController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getAll', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, reportController.getAll)
router.post('/create', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, reportController.create)
router.delete('/deleteById', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, reportController.deleteById)

module.exports = router;