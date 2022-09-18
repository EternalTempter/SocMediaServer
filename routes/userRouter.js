const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.get('/getByEmail', userController.getByEmail);
router.get('/findAllByName', userController.findAllByName)
router.get('/getAll', userController.getAll)

module.exports = router;