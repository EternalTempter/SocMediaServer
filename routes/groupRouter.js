const Router = require('express');
const groupController = require('../controllers/groupController');
const router = new Router();

router.get('/findAllByName', groupController.findAllByName);
router.get('/getById', groupController.getById);
router.get('/getAllUserSubscriptions', groupController.getAllUserSubscriptions)
router.post('/create', groupController.create);

module.exports = router;