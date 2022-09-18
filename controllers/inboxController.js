const uuid = require('uuid');
const ApiError = require('../error/ApiError')
const {Inbox, Users} = require('../models/models')
const { Op } = require("sequelize")

class InboxController {
    async get(req, res) {
        let {id, limit, page} = req.query
        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit; 
        if(!id) {
            return next(ApiError.internal('Не указан обязательный get параметр id')) 
        }
        const inbox = await Inbox.findAndCountAll({where:{[Op.or]: [{inbox_holder_user_id: id}, {inbox_sender_user_id: id}]}, limit, offset})
        if(!inbox) {
            return next(ApiError.internal('Инбоксов по такому айди не существует')) 
        }
        return res.json(inbox)
    }
    async create(req, res) {
        const {last_message, last_message_user_id, inbox_holder_user_id, inbox_sender_user_id} = req.body
        if(!last_message || !last_message_user_id || !inbox_holder_user_id || !inbox_sender_user_id) {
            return next(ApiError.internal('Не указано одно из обязательных полей')) 
        }
        const inbox = await Inbox.create({last_message, last_message_user_id, inbox_holder_user_id, inbox_sender_user_id})
        return res.json(inbox)
    }
    async updateLastMessage(req, res) {
        const {last_message_user_id, last_message, id} = req.body;
        const updatedRows = await Inbox.update({last_message_user_id, last_message}, {where: { id: id }});
        return res.json(updatedRows)
    }
    async getInbox(req, res) {
        const {firstUserId, secondUserId} = req.query;
        const inbox = await Inbox.findOne({where: {[Op.or]: [{[Op.and]: [{inbox_holder_user_id: firstUserId}, {inbox_sender_user_id: secondUserId}]}, {[Op.and]: [{inbox_sender_user_id: firstUserId}, {inbox_holder_user_id: secondUserId}]}]}});
        return res.json(inbox);
    }
}

module.exports = new InboxController();