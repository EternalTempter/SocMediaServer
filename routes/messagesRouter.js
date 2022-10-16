const Router = require('express');
const messagesController = require('../controllers/messagesController');
const router = new Router();

router.post('/create', messagesController.create);
router.get('/getAll', messagesController.getAll)
router.get('/getMessagesCount', messagesController.getMessagesCount)
router.get('/findMessages', messagesController.findMessages)
router.get('/getAllUserMessagesCount', messagesController.getAllUserMessagesCount)
router.get('/checkForNewMessages', messagesController.checkForNewMessages)
router.put('/updateMessage', messagesController.updateMessage)
router.put('/updateView', messagesController.updateView)
router.delete('/deleteMessage', messagesController.deleteMessage)
  
module.exports = router;