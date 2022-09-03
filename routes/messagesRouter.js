const Router = require('express');
const messagesController = require('../controllers/messagesController');
const router = new Router();

router.post('/create', messagesController.create);
router.get('/getAll', messagesController.getAll)
  
module.exports = router;