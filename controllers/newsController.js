const ApiError = require('../error/ApiError')
const {News} = require('../models/models')
const uuid = require("uuid");
const path = require("path");

class NewsController {
    async getAll(req, res, next) {
        let limit = 15;
        const news = await News.findAll({where: {}, limit})
        return res.json(news)
    }
    async create(req, res, next) {
        const {label, description, time_spent} = req.body
        if(!label || !description || !time_spent) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(label.length > 70 || label.length < 2) {
            return next(ApiError.badRequest('Название должно быть от 2 до 70 символов'));
        }

        if(description.length > 350 || description.length < 2) {
            return next(ApiError.badRequest('Описание должно быть от 2 до 350 символов'));
        }

        if(time_spent.length > 60 || time_spent.length < 2) {
            return next(ApiError.badRequest('Описание потраченного времени должно быть от 2 до 60 символов'));
        }

        if(req.decodedToken.role !== "OWNER")  {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        try {
            const {image} = req.files;
            
            if(image.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }

            let fileName = uuid.v4() + '.jpg';
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const news = await News.create({label, description, time_spent, image: fileName});
            return res.json(news)
        }
        catch (e) {
            return next(ApiError.badRequest('Не отправлена картинка'));
        }
    }
    async deleteById(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(req.decodedToken.role !== "OWNER")  {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRows = await News.destroy({where: { id: id }});
        return res.json(updatedRows)
    }
}

module.exports = new NewsController();