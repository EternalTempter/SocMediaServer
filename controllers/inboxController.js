const uuid = require('uuid');
const ApiError = require('../error/ApiError')
const {Inbox, Users} = require('../models/models')
const { Op } = require("sequelize")

class InboxController {
    async get(req, res, next) {
        let {id, limit, page} = req.query
        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit; 
        if(!id) {
            return next(ApiError.internal('Не указан обязательный get параметр id')) 
        }

        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const inbox = await Inbox.findAndCountAll({where:{[Op.or]: [{inbox_holder_user_id: id}, {inbox_sender_user_id: id}]}, limit, offset})
        if(!inbox) {
            return next(ApiError.internal('Инбоксов по такому айди не существует')) 
        }
        return res.json(inbox)
    }
    async create(req, res, next) {
        const {last_message, last_message_user_id, inbox_holder_user_id, inbox_sender_user_id} = req.body
        if(!last_message || !last_message_user_id || !inbox_holder_user_id || !inbox_sender_user_id) {
            return next(ApiError.internal('Не указано одно из обязательных полей')) 
        }

        if(last_message.length > 1000 || last_message.length <= 0) {
            return next(ApiError.badRequest('Слишком большое сообщение'));
        }

        if(req.decodedToken.email !== inbox_holder_user_id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const inbox = await Inbox.create({last_message, last_message_user_id, inbox_holder_user_id, inbox_sender_user_id, viewed: false})
        return res.json(inbox)
    }
    async updateLastMessage(req, res, next) {
        const {last_message_user_id, last_message, id} = req.body;
        if(!last_message_user_id || !last_message || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        
        if(last_message.length > 1000 || last_message.length <= 0) {
            return next(ApiError.badRequest('Слишком большое сообщение'));
        }

        const inbox = await Inbox.findOne({where: { id: id }});
        if(req.decodedToken.email !== inbox.inbox_holder_user_id && req.decodedToken.email !== inbox.inbox_sender_user_id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRows = await Inbox.update({last_message_user_id, last_message, viewed: false}, {where: { id: id }});
        return res.json(updatedRows)
    }
    async updateLastMessageView(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const updatedMessage = await Inbox.update({viewed: true}, {where: {id: id}})
        return res.json(updatedMessage)
    }
    async getInbox(req, res, next) {
        const {firstUserId, secondUserId} = req.query;
        if(!firstUserId || !secondUserId) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(req.decodedToken.email !== firstUserId && req.decodedToken.email !== secondUserId) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const inbox = await Inbox.findOne({where: {[Op.or]: [{[Op.and]: [{inbox_holder_user_id: firstUserId}, {inbox_sender_user_id: secondUserId}]}, {[Op.and]: [{inbox_sender_user_id: firstUserId}, {inbox_holder_user_id: secondUserId}]}]}});
        return res.json(inbox);
    }
}

module.exports = new InboxController();