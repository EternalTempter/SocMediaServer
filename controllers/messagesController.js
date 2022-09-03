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
        const {firstUserId, secondUserId} = req.query;
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
}

module.exports = new MessagesController();