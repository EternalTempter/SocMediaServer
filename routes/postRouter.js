const Router = require('express');
const postController = require('../controllers/postController');
const router = new Router();

router.get('/getAll', postController.getAll)
router.get('/getBestComment', postController.getBestComment)
router.get('/getAllComments', postController.getAllComments)
router.get('/getAllUserPosts', postController.getAllUserPosts)
router.put('/setLike', postController.setLike)
router.put('/setLikeToComment', postController.setLikeToComment)
router.post('/create', postController.create);
router.post('/pasteComment', postController.pasteComment)

  
module.exports = router;