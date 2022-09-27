const uuid = require('uuid');
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
        const group = await GroupUsers.create({group_id: group_id, user_id: id});
        return res.json(group);
    }
    async unsubscribe(req, res, next) {
        const {id, group_id} = req.body;
        if(!group_id || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
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
}

module.exports = new groupUsersController();