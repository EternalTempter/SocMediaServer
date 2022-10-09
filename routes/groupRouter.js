const Router = require('express');
const groupController = require('../controllers/groupController');
const router = new Router();

router.get('/findAllByName', groupController.findAllByName);
router.get('/getById', groupController.getById);
router.get('/getAll', groupController.getAll);
router.get('/getAllUserSubscriptions', groupController.getAllUserSubscriptions)
router.post('/create', groupController.create);
router.delete('/deleteGroup', groupController.deleteGroup);

module.exports = router;