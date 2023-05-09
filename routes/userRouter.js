const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware')
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.post('/registration', RateLimitMiddleware.PostLimiter, userController.registration);
router.post('/login', RateLimitMiddleware.DefaultLimiter, userController.login);
router.get('/activate/:link', RateLimitMiddleware.DefaultLimiter, userController.activate);
router.get('/checkIsActivated', RateLimitMiddleware.DefaultLimiter, userController.checkIsActivated);
router.get('/auth', RateLimitMiddleware.DefaultLimiter, authMiddleware, userController.check);
router.get('/getByEmail', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.getByEmail);
router.get('/getById', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.getById);
router.get('/findAllByName', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.findAllByName)
router.get('/getAll', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.getAll)
router.put('/changeUserRole', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.changeUserRole);
router.delete('/deleteUserByEmail', authMiddleware, RateLimitMiddleware.DefaultLimiter, userController.deleteUserByEmail);

module.exports = router;