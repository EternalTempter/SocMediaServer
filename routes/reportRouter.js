const Router = require('express');
const reportController = require('../controllers/reportController');
const router = new Router();

router.get('/getAll', reportController.getAll)
router.post('/create', reportController.create)
router.delete('/deleteById', reportController.deleteById)

module.exports = router;