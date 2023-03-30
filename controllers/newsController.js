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
        try {
            const {image} = req.files;
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
        const updatedRows = await News.destroy({where: { id: id }});
        return res.json(updatedRows)
    }
}

module.exports = new NewsController();