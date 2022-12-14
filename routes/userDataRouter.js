const Router = require('express');
const userDataController = require('../controllers/userDataController');
const router = new Router();

router.get('/getOne', userDataController.getOne)
router.get('/setDefaultData', userDataController.setDefaultData)
router.put('/updateStatus', userDataController.updateStatus)
router.put('/updateDateBirth', userDataController.updateDateBirth)
router.put('/updateCity', userDataController.updateCity)
router.put('/updateImage', userDataController.updateImage)
router.put('/updatePanoramaImage', userDataController.updatePanoramaImage)

module.exports = router;