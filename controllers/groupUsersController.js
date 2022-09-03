const uuid = require('uuid');
const ApiError = require('../error/ApiError')
const {GroupUsers} = require('../models/models')

class groupUsersController {
    async getAllSubscribers(req, res) {
        const {group_id} = req.query;
        const users = await GroupUsers.findAll({where: {group_id: group_id}})
        return res.json(users);
    }
    async subscribe(req, res) {
        const {id, group_id} = req.query;
        const group = await GroupUsers.create({group_id: group_id, user_id: id});
        return res.json(group);
    }
    async unsubscribe(req, res) {
        const {id, group_id} = req.body;
        const group = await GroupUsers.destroy({where: {group_id: group_id, user_id: id}});
        return res.json(group);
    }
}

module.exports = new groupUsersController();