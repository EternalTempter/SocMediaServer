const Router = require('express');
const groupController = require('../controllers/groupController');
const router = new Router();

router.get('/findAllByName', groupController.findAllByName);
router.get('/getById', groupController.getById);
router.get('/getAll', groupController.getAll);
router.get('/getAllUserSubscriptions', groupController.getAllUserSubscriptions)
router.put('/updateDescription', groupController.updateDescription)
router.put('/updateName', groupController.updateName)
router.put('/updateType', groupController.updateType)
router.put('/updatePanoramaImage', groupController.updatePanoramaImage)
router.put('/updateImage', groupController.updateImage)
router.post('/create', groupController.create);
router.delete('/deleteGroup', groupController.deleteGroup);

module.exports = router;