const Router = require('express');
const postController = require('../controllers/postController');
const router = new Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const RateLimitMiddleware = require('../middleware/RateLimitMiddleware');

router.get('/getAll', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAll)
router.get('/getBestComment', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getBestComment)
router.get('/getAllComments', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllComments)
router.get('/getAllUserPosts', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllUserPosts)
router.get('/findByDescription', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.findByDescription)
router.get('/isPostLiked', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.isPostLiked)
router.get('/isCommentLiked', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.isCommentLiked)
router.get('/getAllFriendsPosts', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllFriendsPosts)
router.get('/getAllLikedPosts', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllLikedPosts)
router.get('/getAllLikes', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllLikes)
router.get('/getUserPostsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getUserPostsCount)
router.get('/getAllGroupPosts', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllGroupPosts)
router.get('/getAllUserCommentsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllUserCommentsCount)
router.get('/getAllLikedPostsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllLikedPostsCount)
router.get('/getUserMostLikedPostCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getUserMostLikedPostCount)
router.get('/getPostCommentsAmount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getPostCommentsAmount)
router.get('/getAllPostsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getAllPostsCount)
router.get('/getUserMostLikedComment', RateLimitMiddleware.DefaultLimiter, postController.getUserMostLikedComment)
router.get('/getCommentById', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getCommentById)
router.get('/getPostById', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.getPostById)
router.put('/setLike', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.setLike)
router.put('/setLikeToComment', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.setLikeToComment)
router.put('/removeLikeFromComment', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.removeLikeFromComment)
router.put('/removeLike', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.removeLike)
router.put('/updateViewsCount', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.updateViewsCount)
router.post('/create', AuthMiddleware, RateLimitMiddleware.PostLimiter, postController.create);
router.post('/pasteComment', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.pasteComment)
router.delete('/deletePost', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.deletePost)
router.delete('/deleteComment', AuthMiddleware, RateLimitMiddleware.DefaultLimiter, postController.deleteComment)
  
module.exports = router;