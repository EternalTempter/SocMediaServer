const {Messages} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")


class MessagesController {
    async create(req, res, next) {
        const {message, outgoing_id, incoming_id} = req.body;
        if(!message || !outgoing_id || !incoming_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const msg = await Messages.create({message, outgoing_id, incoming_id});
        return res.json(msg);
    }
    async getAll(req, res, next) {
        let {firstUserId, secondUserId, limit, page} = req.query;
        if(!firstUserId || !secondUserId) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        // page = page || 1;
        // limit = limit || 30;
        // let offset = page * limit - limit;
        const messages = await Messages.findAll({
        where: {
            [Op.or]: [ 
                { 
                    [Op.and]: [
                        {outgoing_id: firstUserId}, {incoming_id: secondUserId}
                    ],
                },
                {
                    [Op.and]: [
                        {outgoing_id: secondUserId}, {incoming_id: firstUserId}
                    ]
                }
            ]
        }
    });
        return res.json(messages);
    }
    async findMessages(req, res, next) {
        let {queryParameter, id, page, limit} = req.query;
        if(!queryParameter || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        page = page || 1;
        limit = limit || 20;
        let offset = page * limit - limit;
        const msg = await Messages.findAll({where: {message: {[Op.substring]: queryParameter}, [Op.or]: [{outgoing_id: id}, {incoming_id:id}]}}, limit)
        return res.json(msg);
    }
    async updateMessage(req, res, next) {
        const {id, message} = req.body;
        if(!message || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedMessage = await Messages.update({message}, {where: {id: id}})
        return res.json(updatedMessage)
    }
    async deleteMessage(req, res) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const deletedMessage = await Messages.destroy({where: {id: id}})
        return res.json(deletedMessage)
    }
}

module.exports = new MessagesController();