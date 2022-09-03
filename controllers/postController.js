const {Post, Comments} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")

class PostController {
    async create(req, res) {
        const {post_handler_type, post_handler_id, description} = req.body;
        const post = await Post.create({
            post_handler_type, 
            post_handler_id, 
            description, 
            image: '', 
            likes_amount: 0, 
            comments_amount: 0, 
            shares_amount: 0, 
            views_amount: 0
        });
        return res.json(post);
    }
    async getAll(req, res) {
        const posts = await Post.findAll();
        return res.json(posts);
    }
    async setLike(req, res) {
        const {id} = req.body
        const updatedLikes = await Post.increment({likes_amount: 1}, {where: {id: id}})
        return res.json(updatedLikes)
    }
    async getBestComment(req, res) {
        const {id} = req.query
        const bestComment = await Comments.max('likes_amount', {where: {post_id: id}})
        return res.json(bestComment);
    }
    async pasteComment(req, res) {
        const {post_id, user_id, comment} = req.body;
        const createdComment = await Comments.create({post_id: post_id, user_id: user_id, comment: comment, likes_amount: 0})
        return res.json(createdComment) 
    }
    async setLikeToComment(req, res) {
        const {id} = req.body;
        const updatedComment = await Comments.increment({likes_amount: 1}, {where: {id: id}})
        return res.json(updatedComment) 
    }
    async getAllComments(req, res) {
        const {post_id} = req.query;
        const comments = await Comments.findAll({post_id: post_id})
        return res.json(comments) 
    }
    async getAllUserPosts(req, res) {
        const {id} = req.query;
        const posts = await Post.findAll({where: {[Op.and]: [{post_handler_type: 'USER'}, {post_handler_id: id}]}}) 
        return res.json(posts);
    }
    // async isPostLiked(req, res) {
    //     const {user_id, post_id} = req.query;
    //     const likedPost = await Post.findOne({})
    // }
}

module.exports = new PostController();