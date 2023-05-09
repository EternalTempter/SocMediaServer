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
        const groups = await Group.findAll({where: {[Op.or]: [{group_name: {[Op.substring]: name.charAt(0).toUpperCase() + name.slice(1)}}, {group_name: {[Op.substring]: name}}]}})
        return res.json(groups);
    }
    async create(req, res, next) {
        const {group_name, type, description, owner_id} = req.body;
        if(!group_name || !description || !type || !owner_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(group_name.length > 40 || group_name.length < 2) {
            return next(ApiError.badRequest('Наименование группы должно быть от 2 до 40 символов'));
        }
        if(description.length > 200 || description.length < 2) {
            return next(ApiError.badRequest('Описание группы должно быть от 2 до 200 символов'));
        }
        if(type !== "Анекдоты" && type !== "Наука" && type !== "Новости" && type !== "Игры" && type !== "Другое") {
            return next(ApiError.badRequest('Подобного типа групп не существует'));
        }

        if(req.decodedToken.email !== owner_id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const groupsCount = await Group.findAndCountAll({where: {owner_id: owner_id}});
        if(groupsCount.count > 3) {
            return next(ApiError.badRequest('У пользователя не может быть больше трех групп'));
        }

        try {
            const {image, panoramaImage} = req.files;
            
            if(image.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }

            if(panoramaImage.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер панорамной картинки'));
            }

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
        if(req.decodedToken.email !== id) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
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

        const groupCheck = await Group.findOne({where: {id: group_id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
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

        if(description.length > 200 || description.length < 2) {
            return next(ApiError.badRequest('Описание группы должно быть от 2 до 200 символов'));
        }

        const groupCheck = await Group.findOne({where: {id: id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await Group.update({description}, {where: { id: id }});
        return res.json(updatedRow)
    }
    async updateName(req, res, next) {
        const {group_name, id} = req.body;
        if(!group_name || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(group_name.length > 40 || group_name.length < 2) {
            return next(ApiError.badRequest('Наименование группы должно быть от 2 до 40 символов'));
        }

        const groupCheck = await Group.findOne({where: {id: id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await Group.update({group_name}, {where: { id: id }});
        return res.json(updatedRow)
    }
    async updateType(req, res, next) {
        const {type, id} = req.body;
        if(!type || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        
        if(type !== "Анекдоты" && type !== "Наука" && type !== "Новости" && type !== "Игры" && type !== "Другое") {
            return next(ApiError.badRequest('Подобного типа групп не существует'));
        }

        const groupCheck = await Group.findOne({where: {id: id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await Group.update({type}, {where: { id: id }});
        return res.json(updatedRow)
    }
    async updateImage(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        
        const groupCheck = await Group.findOne({where: {id: id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        try {
            const {img} = req.files;
            if(img.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }
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
        
        const groupCheck = await Group.findOne({where: {id: id}});
        if(groupCheck.owner_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }
        
        try {
            const {img} = req.files;
            if(img.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }
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