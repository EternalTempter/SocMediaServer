const {Messages} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")


class MessagesController {
    async create(req, res) {
        const {message, outgoing_id, incoming_id} = req.body;
        const msg = await Messages.create({message, outgoing_id, incoming_id});
        return res.json(msg);
    }
    async getAll(req, res) {
        let {firstUserId, secondUserId, limit, page} = req.query;
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
    async findMessages(req, res) {
        let {queryParameter, id, page, limit} = req.query;
        page = page || 1;
        limit = limit || 20;
        let offset = page * limit - limit;
        const msg = await Messages.findAll({where: {message: {[Op.substring]: queryParameter}, [Op.or]: [{outgoing_id: id}, {incoming_id:id}]}}, limit)
        return res.json(msg);
    }
    async updateMessage(req, res) {
        const {id, message} = req.body;
        const updatedMessage = await Messages.update({message}, {where: {id: id}})
        return res.json(updatedMessage)
    }
    async deleteMessage(req, res) {
        const {id} = req.body;
        const deletedMessage = await Messages.destroy({where: {id: id}})
        return res.json(deletedMessage)
    }
}

module.exports = new MessagesController();