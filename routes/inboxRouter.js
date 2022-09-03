const Router = require('express');
const inboxController = require('../controllers/inboxController');
const router = new Router();

router.get('/get', inboxController.get);
router.get('/getInbox', inboxController.getInbox);
router.post('/create', inboxController.create);
router.put('/updateLastMessage', inboxController.updateLastMessage);

module.exports = router;