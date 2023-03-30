const Router = require('express');
const newsController = require('../controllers/newsController');
const router = new Router();

router.get('/getAll', newsController.getAll);
router.post('/create', newsController.create);
router.delete('/deleteById', newsController.deleteById);

module.exports = router;