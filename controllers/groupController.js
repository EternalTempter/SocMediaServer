const ApiError = require('../error/ApiError')
const {Group, GroupUsers, Post, Likes} = require('../models/models')
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
            await GroupUsers.create({group_id: group.id, user_id: owner_id})
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
            await GroupUsers.create({group_id: group.id, user_id: owner_id})
            return res.json(group);
        }
    }
    async getAllUserSubscriptions(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit; 
        const groups = await GroupUsers.findAndCountAll({where: {user_id: id}, limit, offset})
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
        const {ids} = req.query;
        if(!ids) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 15;
        let offset = page * limit - limit; 
        let groups;
        if(JSON.parse(ids).length > 0)
            groups = await Group.findAndCountAll({where: {[Op.not]: [{id: JSON.parse(ids)}]}, limit, offset});
        else
            groups = await Group.findAndCountAll({limit, offset});
        
        return res.json(groups);
    }
    async deleteGroup(req, res, next) {
        const {group_id} = req.body;
        if(!group_id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        } 
        const group = await Group.destroy({where: {id: group_id}});
        await GroupUsers.destroy({where: {group_id: group_id}})
        await Post.destroy({where: {post_handler_type: "GROUP", post_handler_id: group_id}})
        return res.json(group);
    }
    async updateDescription(req, res, next) {
        const {description, id} = req.body;
        if(!description || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedRow = await Group.update({description}, {where: { id: id }});
        return res.json(updatedRow)
    }
    async updateImage(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        try {
            const {img} = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const updatedRow = await Group.update({image: fileName}, {where: { id: id }});
            return res.json(updatedRow)
        }
        catch (e) {
            return res.json('Ошибка' + e.message)
        }
    }
    async updatePanoramaImage(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        try {
            const {img} = req.files;
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const updatedRow = await Group.update({panoramaImage: fileName}, {where: { id: id }});
            return res.json(updatedRow)
        }
        catch (e) {
            return res.json('Ошибка' + e.message)
        }
    }
}

module.exports = new groupController();