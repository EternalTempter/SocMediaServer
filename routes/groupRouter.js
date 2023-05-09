const Router = require('express');
const groupController = require('../controllers/groupController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/findAllByName', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.findAllByName);
router.get('/getById', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.getById);
router.get('/getAll', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.getAll);
router.get('/getAllUserSubscriptions', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.getAllUserSubscriptions)
router.put('/updateDescription', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.updateDescription)
router.put('/updateName', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.updateName)
router.put('/updateType', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.updateType)
router.put('/updatePanoramaImage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.updatePanoramaImage)
router.put('/updateImage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.updateImage)
router.post('/create', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.create);
router.delete('/deleteGroup', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, groupController.deleteGroup);

module.exports = router;