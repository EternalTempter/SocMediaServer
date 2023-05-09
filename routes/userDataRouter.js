const Router = require('express');
const userDataController = require('../controllers/userDataController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getOne', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.getOne)
router.get('/setDefaultData', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.setDefaultData)
router.put('/updateStatus', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateStatus)
router.put('/updateDateBirth', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateDateBirth)
router.put('/updateCity', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateCity)
router.put('/updateImage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateImage)
router.put('/updateName', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateName)
router.put('/updateSurname', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updateSurname)
router.put('/updatePanoramaImage', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, userDataController.updatePanoramaImage)

module.exports = router;