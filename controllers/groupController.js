const ApiError = require('../error/ApiError')
const {Group, GroupUsers} = require('../models/models')
const { Op } = require("sequelize");


class groupController {
    async findAllByName(req, res) {
        const {name} = req.query;
        const groups = await Group.findAll({where: {group_name: {[Op.substring]: name}}})
        return res.json(groups);
    }
    async create(req, res) {
        const {group_name, image, description} = req.body;
        const group = await Group.create({group_name, image, description});
        return res.json(group);
    }
    async getAllUserSubscriptions(req, res) {
        const {id} = req.query;
        const groups = await GroupUsers.findAll({where: {user_id: id}})
        return res.json(groups);
    }
    async getById(req, res) {
        const {id} = req.query;
        const group = await Group.findOne({where: {id: id}})
        return res.json(group);
    }
    async getAll(req, res) {
        const groups = await Group.findAll({limit: 10});
        return res.json(groups);
    }
}

module.exports = new groupController();