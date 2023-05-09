const {Messages} = require('../models/models');
const ApiError = require('../error/ApiError')
const { Op } = require("sequelize")


class MessagesController {
    async create(req, res, next) {
        const {message, outgoing_id, incoming_id} = req.body;
        if(!message || !outgoing_id || !incoming_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(message.length > 1000 || message.length <= 0) {
            return next(ApiError.badRequest('Слишком большое сообщение'));
        }

        if(req.decodedToken.email !== outgoing_id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const msg = await Messages.create({message, outgoing_id, incoming_id, viewed: false});
        return res.json(msg);
    }
    async getAll(req, res, next) {
        let {firstUserId, secondUserId, limit, page} = req.query;
        if(!firstUserId || !secondUserId) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(req.decodedToken.email !== firstUserId && req.decodedToken.email !== secondUserId) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit;
        const messages = await Messages.findAndCountAll({
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
        }, limit, offset, order: [['id', 'ASC']]
    });
        return res.json(messages);
    }
    async findMessages(req, res, next) {
        let {queryParameter, id, page, limit} = req.query;
        if(!queryParameter || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
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

        if(message.length > 1000 || message.length <= 0) {
            return next(ApiError.badRequest('Слишком большое сообщение'));
        }

        const checkMessage = await Messages.findOne({where: {id: id}});
        if(checkMessage.outgoing_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedMessage = await Messages.update({message}, {where: {id: id}})
        return res.json(updatedMessage)
    }
    async updateView(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const updatedMessage = await Messages.update({viewed: true}, {where: {id: id}})
        return res.json(updatedMessage)
    }
    async deleteMessage(req, res) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        
        const checkMessage = await Messages.findOne({where: {id: id}});
        if(checkMessage.outgoing_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const deletedMessage = await Messages.destroy({where: {id: id}})
        return res.json(deletedMessage)
    }
    async getMessagesCount(req, res) {
        const {firstUserId, secondUserId} = req.query;
        if(!firstUserId || !secondUserId) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(firstUserId !== req.decodedToken.email && secondUserId !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const messagesCount = await Messages.count({
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
        return res.json(messagesCount);
    }
    async getAllUserMessagesCount(req, res) {
        const {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }

        if(user_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const messagesCount = await Messages.count({where: {[Op.or]: [{outgoing_id: user_id}, {incoming_id: user_id}]}});
        return res.json(messagesCount);
    }
    async checkForNewMessages(req, res, next) {
        const {user_id} = req.query;
        if(!user_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        
        if(user_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const message = await Messages.findOne({where: {incoming_id: user_id, viewed: false}})
        if(message) return res.json(true);
        else return res.json(false);
    }
}

module.exports = new MessagesController();