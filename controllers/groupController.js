const ApiError = require('../error/ApiError')
const {Group, GroupUsers} = require('../models/models')
const { Op } = require("sequelize");
const uuid = require("uuid");
const path = require("path");

class groupController {
    async findAllByName(req, res, next) {
        const {name} = req.query;
        if(!name) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const groups = await Group.findAll({where: {group_name: {[Op.substring]: name}}})
        return res.json(groups);
    }
    async create(req, res, next) {
        const {group_name, type, description, owner_id} = req.body;
        if(!group_name || !description || !type || !owner_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        try {
            const {image, panoramaImage} = req.files;
            let fileName = uuid.v4() + '.jpg';
            image.mv(path.resolve(__dirname, '..', 'static', fileName))

            let fileName2 = uuid.v4() + '.jpg';
            panoramaImage.mv(path.resolve(__dirname, '..', 'static', fileName2))

            const group = await Group.create({
                group_name: group_name, 
                image: fileName, 
                panoramaImage: fileName2, 
                type: type, 
                description: description,
                owner_id: owner_id
            });
            return res.json(group);
        }
        catch(e) {
            const group = await Group.create({
                group_name: group_name, 
                image: 'none', 
                panoramaImage: 'none', 
                type: type, 
                description: description,
                owner_id: owner_id
            });
            return res.json(group);
        }
    }
    async getAllUserSubscriptions(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const groups = await GroupUsers.findAll({where: {user_id: id}})
        return res.json(groups);
    }
    async getById(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const group = await Group.findOne({where: {id: id}})
        return res.json(group);
    }
    async getAll(req, res) {
        const groups = await Group.findAll({limit: 10});
        return res.json(groups);
    }
}

module.exports = new groupController();