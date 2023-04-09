const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const messagesRouter = require('./messagesRouter');
const inboxRouter = require('./inboxRouter');
const postRouter = require('./postRouter');
const userDataRouter = require('./userDataRouter');
const friendshipRouter = require('./friendshipRouter');
const groupRouter = require('./groupRouter')
const groupUsersRouter = require('./groupUsersRouter')
const newsRouter = require('./newsRouter')
const reportRouter = require('./reportRouter')


router.use('/user', userRouter);
router.use('/messages', messagesRouter);
router.use('/inbox', inboxRouter);
router.use('/post', postRouter);
router.use('/userData', userDataRouter);
router.use('/friendship', friendshipRouter);
router.use('/group', groupRouter);
router.use('/groupUser', groupUsersRouter);
router.use('/news', newsRouter);
router.use('/report', reportRouter);

module.exports = router;