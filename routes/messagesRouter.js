const Router = require('express');
const messagesController = require('../controllers/messagesController');
const router = new Router();

router.post('/create', messagesController.create);
router.get('/getAll', messagesController.getAll)
router.get('/findMessages', messagesController.findMessages)
router.put('/updateMessage', messagesController.updateMessage)
router.delete('/deleteMessage', messagesController.deleteMessage)
  
module.exports = router;