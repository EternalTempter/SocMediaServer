const {Post, Comments, Likes, Friendship} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")
const uuid = require("uuid");
const path = require("path");

class PostController {
    async create(req, res, next) {
        const {post_handler_type, post_handler_id, description} = req.body;
        if(!post_handler_type || !post_handler_id || !description) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        try {
            const {img} = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const post = await Post.create({
                post_handler_type, 
                post_handler_id, 
                description, 
                image: fileName, 
                likes_amount: 0, 
                comments_amount: 0, 
                shares_amount: 0, 
                views_amount: 0
            });
            return res.json(post)
        }
        catch (e) {
            const post = await Post.create({
                post_handler_type, 
                post_handler_id, 
                description, 
                image: 'none', 
                likes_amount: 0, 
                comments_amount: 0, 
                shares_amount: 0, 
                views_amount: 0
            });
            return res.json(post)
        }
    }
    async getAll(req, res) {
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit; 
        const posts = await Post.findAndCountAll({limit, offset, order: [['id', 'DESC']]});
        return res.json(posts);
    }
    async getAllFriendsPosts(req, res, next) {
        const {id, friendsArray} = req.query;
        if(!id || !friendsArray) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit; 
        const posts = await Post.findAndCountAll({where: {post_handler_id: JSON.parse(friendsArray)}, limit, offset, order: [['id', 'DESC']]})
        return res.json(posts)
    }
    async getAllLikes(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const likes = await Likes.findAll({where: {user_id: id, type: 'POST_LIKE'}})
        return res.json(likes)
    }
    async getAllLikedPosts(req, res, next) {
        const {id, likesArray} = req.query;
        if(!id || !likesArray) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit; 
        const posts = await Post.findAndCountAll({where: {id: JSON.parse(likesArray)}, limit, offset, order: [['id', 'DESC']]})
        return res.json(posts)
    }
    async setLike(req, res, next) {
        const {id, user_id} = req.body
        if(!id || !user_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedLikes = await Post.increment({likes_amount: 1}, {where: {id: id}})
        await Likes.create({post_id: id, user_id: user_id, type: 'POST_LIKE'})
        return res.json(updatedLikes)
    }
    async removeLike(req, res, next) {
        const {id, user_id, type} = req.body
        if(!id || !user_id || !type) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedLikes = await Post.decrement({likes_amount: 1}, {where: {id: id}})
        await Likes.destroy({where: {post_id: id, user_id: user_id, type: type}})
        return res.json(updatedLikes)
    }
    async getBestComment(req, res, next) {
        const {id} = req.query
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const bestComment = await Comments.findAll({where: {post_id: id}}, { group: 'likes_amount'})
        return res.json(bestComment.pop());
    }
    async pasteComment(req, res, next) {
        const {post_id, user_id, comment} = req.body;
        if(!post_id || !user_id || !comment) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const createdComment = await Comments.create({post_id: post_id, user_id: user_id, comment: comment, likes_amount: 0})
        await Post.increment({comments_amount: 1}, {where: {id: post_id}})
        return res.json(createdComment) 
    }
    async setLikeToComment(req, res, next) {
        const {id, user_id} = req.body;
        if(!id || !user_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedComment = await Comments.increment({likes_amount: 1}, {where: {id: id}})
        await Likes.create({post_id: id, user_id: user_id, type: 'COMMENT_LIKE'})
        return res.json(updatedComment) 
    }
    async removeLikeFromComment(req, res, next) {
        const {id, user_id, type} = req.body;
        if(!id || !user_id || !type) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedComment = await Comments.decrement({likes_amount: 1}, {where: {id: id}})
        await Likes.destroy({where: {post_id: id, user_id: user_id, type: type}})
        return res.json(updatedComment) 
    }
    async getAllComments(req, res, next) {
        const {post_id} = req.query;
        if(!post_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const comments = await Comments.findAll({where: {post_id: post_id}})
        return res.json(comments) 
    }
    async getAllUserPosts(req, res, next) {
        let {id, limit, page} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        limit = limit || 5
        page = page || 1
        let offset = page * limit - limit
        const posts = await Post.findAndCountAll({where: {[Op.and]: [{post_handler_type: 'USER'}, {post_handler_id: id}]}, limit, offset, order: [['id', 'DESC']]}) 
        return res.json(posts);
    }
    async isPostLiked(req, res, next) {
        const {user_id, post_id} = req.query;
        if(!user_id || !post_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const likedPost = await Likes.findOne({where: {user_id: user_id, post_id: post_id, type: 'POST_LIKE'}})
        return res.json(likedPost !== null);
    }
    async isCommentLiked(req, res, next) {
        const {user_id, comment_id} = req.query;
        if(!user_id || !comment_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const likedComment = await Likes.findOne({where: {user_id: user_id, post_id: comment_id, type: 'COMMENT_LIKE'}})
        return res.json(likedComment !== null);
    }
    async updateViewsCount(req, res, next) {
        const {post_id} = req.body;
        if(!post_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const updatedPostViews = Post.increment({views_amount: 1}, {where: {id: post_id}});
        return res.json(updatedPostViews);
    }
    async findByDescription(req, res, next) {
        const {description, user_id} = req.query;
        if(!description || !user_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const posts = await Post.findAll({where: {description: {[Op.substring]: description}, post_handler_id: user_id}})
        return res.json(posts);
    }
    async getUserPostsCount(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const count = await Post.count({where: {post_handler_id: id}})
        return res.json(count);
    }
    async getAllGroupPosts(req, res, next) {
        let {id, limit, page} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        limit = limit || 5
        page = page || 1
        let offset = page * limit - limit
        const posts = await Post.findAndCountAll({where: {[Op.and]: [{post_handler_type: 'GROUP'}, {post_handler_id: id}]}, limit, offset, order: [['id', 'DESC']]}) 
        return res.json(posts);
    }
    async getAllUserCommentsCount(req, res, next) {
        let {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const commentsCount = await Comments.count({where: {user_id: user_id}});
        return res.json(commentsCount);
    }
    async getAllLikedPostsCount(req, res, next) {
        let {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const likesCount = await Likes.count({where: {user_id: user_id}});
        return res.json(likesCount);
    }
    async getUserMostLikedPostCount(req, res, next) {
        let {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const mostLikedPostCount = await Post.max('likes_amount', {where: {post_handler_id: user_id}});
        return res.json(mostLikedPostCount);
    }
    async getUserMostLikedComment(req, res, next) {
        let {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const mostLikedPostCount = await Comments.max('likes_amount', {where: {user_id: user_id}});
        const mostLikedPost = await Comments.findOne({where: {user_id: user_id, likes_amount: mostLikedPostCount}});
        return res.json(mostLikedPost);
    }
    async getPostCommentsAmount(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const post = await Post.findOne({where: {id: id}})
        return res.json(post.comments_amount);
    }
    async getCommentById(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const comment = await Comments.findAll({where: {id: id}})
        return res.json(comment);
    }
    async getPostById(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const post = await Post.findAll({where: {id: id}})
        return res.json(post);
    }
    async deletePost(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const post = await Post.destroy({where: {id: id}})
        return res.json(post);
    }
    async deleteComment(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const comment = await Comments.destroy({where: {id: id}})
        return res.json(comment);
    }
    async getAllPostsCount(req, res, next) {
        const post = await Post.count({where: {}});
        return res.json(post);
    }
}

module.exports = new PostController();