const uuid = require('uuid');
const sequelize = require('sequelize');
const ApiError = require('../error/ApiError')
const {GroupUsers} = require('../models/models')

class groupUsersController {
    async getAllSubscribers(req, res, next) {
        const {group_id} = req.query;
        if(!group_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const users = await GroupUsers.findAll({where: {group_id: group_id}})
        return res.json(users);
    }
    async subscribe(req, res, next) {
        const {id, group_id} = req.query;
        if(!group_id || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const group = await GroupUsers.create({group_id: group_id, user_id: id});
        return res.json(group);
    }
    async unsubscribe(req, res, next) {
        const {id, group_id} = req.body;
        if(!group_id || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        const group = await GroupUsers.destroy({where: {group_id: group_id, user_id: id}});
        return res.json(group);
    }
    async getUserGroupSubsCount(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const count = await GroupUsers.count({where: {user_id: id}})
        return res.json(count);
    }
    async getGroupSubsCount(req, res, next) {
        const {group_id} = req.query;
        if(!group_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const count = await GroupUsers.count({where: {group_id: group_id}})
        return res.json(count);
    }
    async getFirstGroupSubs(req, res, next) {
        const {group_id, amount} = req.query;
        if(!group_id || !amount) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const users = await GroupUsers.findAll({where: {group_id: group_id}, limit: amount});
        return res.json(users);
    }
    async getGroupUser(req, res, next) {
        const {group_id, user_id} = req.query;
        if(!group_id || !user_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const user = await GroupUsers.findOne({where: {group_id: group_id, user_id: user_id}});
        return res.json(user);
    }
}

module.exports = new groupUsersController();