const {Post, Comments, Likes, Friendship} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")
const uuid = require("uuid");
const path = require("path");

class PostController {
    async create(req, res) {
        const {post_handler_type, post_handler_id, description} = req.body;
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
        const posts = await Post.findAndCountAll({limit, offset});
        return res.json(posts);
    }
    async getAllFriendsPosts(req, res) {
        const {id, friendsArray} = req.query;
        const posts = await Post.findAll({where: {post_handler_id: JSON.parse(friendsArray)}})
        return res.json(posts)
    }
    async getAllLikes(req, res) {
        const {id} = req.query;
        const likes = await Likes.findAll({where: {user_id: id, type: 'POST_LIKE'}})
        return res.json(likes)
    }
    async getAllLikedPosts(req, res) {
        const {id, likesArray} = req.query;
        const posts = await Post.findAll({where: {id: JSON.parse(likesArray)}})
        return res.json(posts)
    }
    async setLike(req, res) {
        const {id, user_id} = req.body
        const updatedLikes = await Post.increment({likes_amount: 1}, {where: {id: id}})
        await Likes.create({post_id: id, user_id: user_id, type: 'POST_LIKE'})
        return res.json(updatedLikes)
    }
    async removeLike(req, res) {
        const {id, user_id, type} = req.body
        const updatedLikes = await Post.decrement({likes_amount: 1}, {where: {id: id}})
        await Likes.destroy({where: {post_id: id, user_id: user_id, type: type}})
        return res.json(updatedLikes)
    }
    async getBestComment(req, res) {
        const {id} = req.query
        // const bestComment = await Comments.findAll({where: {post_id: id}})
        const bestComment = await Comments.findAll({where: {post_id: id}}, { group: 'likes_amount'})
        return res.json(bestComment.pop());
    }
    async pasteComment(req, res) {
        const {post_id, user_id, comment} = req.body;
        const createdComment = await Comments.create({post_id: post_id, user_id: user_id, comment: comment, likes_amount: 0})
        await Post.increment({comments_amount: 1}, {where: {id: post_id}})
        return res.json(createdComment) 
    }
    async setLikeToComment(req, res) {
        const {id, user_id} = req.body;
        const updatedComment = await Comments.increment({likes_amount: 1}, {where: {id: id}})
        await Likes.create({post_id: id, user_id: user_id, type: 'COMMENT_LIKE'})
        return res.json(updatedComment) 
    }
    async removeLikeFromComment(req, res) {
        const {id, user_id, type} = req.body;
        const updatedComment = await Comments.decrement({likes_amount: 1}, {where: {id: id}})
        await Likes.destroy({where: {post_id: id, user_id: user_id, type: type}})
        return res.json(updatedComment) 
    }
    async getAllComments(req, res) {
        const {post_id} = req.query;
        const comments = await Comments.findAll({where: {post_id: post_id}})
        return res.json(comments) 
    }
    async getAllUserPosts(req, res) {
        let {id, limit, page} = req.query;
        limit = limit || 5
        page = page || 1
        let offset = page * limit - limit
        const posts = await Post.findAndCountAll({where: {[Op.and]: [{post_handler_type: 'USER'}, {post_handler_id: id}]}, limit, offset}) 
        return res.json(posts);
    }
    async isPostLiked(req, res) {
        const {user_id, post_id} = req.query;
        const likedPost = await Likes.findOne({where: {user_id: user_id, post_id: post_id, type: 'POST_LIKE'}})
        return res.json(likedPost !== null);
    }
    async isCommentLiked(req, res) {
        const {user_id, comment_id} = req.query;
        const likedComment = await Likes.findOne({where: {user_id: user_id, post_id: comment_id, type: 'COMMENT_LIKE'}})
        return res.json(likedComment !== null);
    }
    async updateViewsCount(req, res) {
        const {post_id} = req.body;
        const updatedPostViews = Post.increment({views_amount: 1}, {where: {id: post_id}});
        return res.json(updatedPostViews);
    }
    async findByDescription(req, res) {
        const {description, user_id} = req.query;
        const posts = await Post.findAll({where: {description: {[Op.substring]: description}, post_handler_id: user_id}})
        return res.json(posts);
    }
    async getUserPostsCount(req, res) {
        const {id} = req.query;
        const count = await Post.count({where: {post_handler_id: id}})
        return res.json(count);
    }
}

module.exports = new PostController();