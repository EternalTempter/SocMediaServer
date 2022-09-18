const ApiError = require('../error/ApiError')
const { Op } = require("sequelize");
const { Friendship } = require('../models/models');

class FriendshipController {
    async getAllFriends(req, res) {
        const {id} = req.query;
        const friends = await Friendship.findAll({where: {[Op.or]: [{[Op.and]: [{profile_to: id}, {status: 'ACCEPTED'}]}, {[Op.and]: [{profile_from: id}, {status: 'ACCEPTED'}]}]}})
        return res.json(friends);
    }
    async getAllNotifications(req, res) {
        const {id} = req.query;
        const friends = await Friendship.findAll({where: {[Op.or]: [{[Op.and]: [{profile_to: id}, {status: 'PENDING'}]}, {[Op.and]: [{profile_from: id}, {status: 'PENDING'}]}]}})
        return res.json(friends);
    }
    async getAllSubscribers(req, res) {
        const {id} = req.query;
        const friends = await Friendship.findAll({where: {[Op.and]: [{profile_to: id}, {status: 'REJECTED'}]}})
        return res.json(friends);
    }
    async sendFriendRequest(req, res) {
        const {profile_from, profile_to} = req.body;
        const friendRequest = await Friendship.create({profile_from, profile_to, status: 'PENDING'}) 
        return res.json(friendRequest);
    }
    async acceptFriendRequest(req, res) {
        const {profile_from, profile_to} = req.body;
        const friendRequest = await Friendship.update({status: 'ACCEPTED'}, {where: {[Op.and]: [{profile_from}, {profile_to}]}}) 
        return res.json(friendRequest);
    }
    async rejectFriendRequest(req, res) {
        const {profile_from, profile_to} = req.body;
        const friendRequest = await Friendship.update({status: 'REJECTED'}, {where: {[Op.and]: [{profile_from}, {profile_to}]}}) 
        return res.json(friendRequest);
    }
    async deleteFriend(req, res) {
        const {profile_from, profile_to} = req.body;
        const friendRequest = await Friendship.destroy({where: {[Op.and]: [{profile_from}, {profile_to}, {status: 'ACCEPTED'}]}}) 
        return res.json(friendRequest);
    }
    async deleteFriendRequest(req, res) {
        const {profile_from, profile_to} = req.body;
        const friendRequest = await Friendship.destroy({where: {[Op.and]: [{profile_from}, {profile_to}, {status: 'PENDING'}]}}) 
        return res.json(friendRequest);
    }
    async getUserSubscribersCount(req, res) {
        const {id} = req.query;
        const subs = await Friendship.count({where: {[Op.and]: [{[Op.or]: [{profile_from: id}, {profile_to: id}]}, {status: 'PENDING'}]}});
        return res.json(subs);
    }
    async getUserFriendsCount(req, res) {
        const {id} = req.query;
        const subs = await Friendship.count({where: {[Op.and]: [{[Op.or]: [{profile_from: id}, {profile_to: id}]}, {status: 'ACCEPTED'}]}});
        return res.json(subs);
    }
}

module.exports = new FriendshipController();