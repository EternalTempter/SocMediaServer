const ApiError = require('../error/ApiError')
const { Op } = require("sequelize");
const { Friendship } = require('../models/models');

class FriendshipController {
    async getAllFriends(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        let {limit, page} = req.query;
        limit = limit || 10;
        page = page || 1;
        let offset = page * limit - limit; 
        const friends = await Friendship.findAndCountAll({where: {[Op.or]: [{[Op.and]: [{profile_to: id}, {status: 'ACCEPTED'}]}, {[Op.and]: [{profile_from: id}, {status: 'ACCEPTED'}]}]}, limit, offset})
        return res.json(friends);
    }
    async getAllNotifications(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friends = await Friendship.findAll({
            where: {
                    [Op.or]: [
                        {profile_to: id, [Op.or]: [{status: 'PENDING'}, {status: 'REJECTED'}]},
                        {profile_from: id, [Op.or]: [{status: 'PENDING'}, {status: 'REJECTED'}]} 
                    ],
            }})
        return res.json(friends);
    }
    async getAllSubscribers(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friends = await Friendship.findAll({where: {[Op.and]: [{profile_to: id}, {status: 'REJECTED'}]}})
        return res.json(friends);
    }
    async sendFriendRequest(req, res, next) {
        const {profile_from, profile_to} = req.body;
        if(!profile_from || !profile_to) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== profile_from) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friendRequest = await Friendship.create({profile_from, profile_to, status: 'PENDING'}) 
        return res.json(friendRequest);
    }
    async acceptFriendRequest(req, res, next) {
        const {profile_from, profile_to} = req.body;
        if(!profile_from || !profile_to) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== profile_to) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friendRequest = await Friendship.update({status: 'ACCEPTED'}, {where: {[Op.and]: [{profile_from}, {profile_to}]}}) 
        return res.json(friendRequest);
    }
    async rejectFriendRequest(req, res, next) {
        const {profile_from, profile_to} = req.body;
        if(!profile_from || !profile_to) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== profile_to) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friendRequest = await Friendship.update({status: 'REJECTED'}, {where: {[Op.and]: [{profile_from}, {profile_to}]}}) 
        return res.json(friendRequest);
    }
    async deleteFriend(req, res, next) {
        const {profile_from, profile_to} = req.body;
        if(!profile_from || !profile_to) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== profile_from && req.decodedToken.email !== profile_to) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friendRequest = await Friendship.destroy({where: {[Op.or]: [{profile_from: profile_from, profile_to: profile_to, status: 'ACCEPTED'}, {profile_from: profile_to, profile_to: profile_from, status: 'ACCEPTED'}]}}) 
        return res.json(friendRequest);
    }
    async deleteFriendRequest(req, res, next) {
        const {profile_from, profile_to} = req.body;
        if(!profile_from || !profile_to) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== profile_from) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const friendRequest = await Friendship.destroy({where: {[Op.and]: [{profile_from}, {profile_to}, {[Op.or]: [{status: 'PENDING'}, {status: 'REJECTED'}]}]}}) 
        return res.json(friendRequest);
    }
    async getUserSubscribersCount(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const subs = await Friendship.count({where: {profile_to: id, status: 'PENDING'}});
        return res.json(subs);
    }
    async getUserFriendsCount(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const subs = await Friendship.count({where: {[Op.and]: [{[Op.or]: [{profile_from: id}, {profile_to: id}]}, {status: 'ACCEPTED'}]}});
        return res.json(subs);
    }
}

module.exports = new FriendshipController();