const Router = require('express');
const postController = require('../controllers/postController');
const router = new Router();

router.get('/getAll', postController.getAll)
router.get('/getBestComment', postController.getBestComment)
router.get('/getAllComments', postController.getAllComments)
router.get('/getAllUserPosts', postController.getAllUserPosts)
router.get('/findByDescription', postController.findByDescription)
router.get('/isPostLiked', postController.isPostLiked)
router.get('/isCommentLiked', postController.isCommentLiked)
router.get('/getAllFriendsPosts', postController.getAllFriendsPosts)
router.get('/getAllLikedPosts', postController.getAllLikedPosts)
router.get('/getAllLikes', postController.getAllLikes)
router.get('/getUserPostsCount', postController.getUserPostsCount)
router.get('/getAllGroupPosts', postController.getAllGroupPosts)
router.put('/setLike', postController.setLike)
router.put('/setLikeToComment', postController.setLikeToComment)
router.put('/removeLikeFromComment', postController.removeLikeFromComment)
router.put('/removeLike', postController.removeLike)
router.put('/updateViewsCount', postController.updateViewsCount)
router.post('/create', postController.create);
router.post('/pasteComment', postController.pasteComment)
  
module.exports = router;