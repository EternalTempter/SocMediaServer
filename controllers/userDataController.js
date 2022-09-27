const {UserData} = require('../models/models');
const ApiError = require('../error/ApiError')
const uuid = require("uuid");
const path = require("path");

class userDataController {
    async getOne(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const userData = await UserData.findOne({where: {user_id: id}});
        return res.json(userData);
    }
    async setDefaultData(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const data = await UserData.create({user_id: id, date_birth: '', status: '', city: '', image: 'none', panoramaImage: 'none'})
        return res.json(data);
    }
    async updateStatus(req, res, next) {
        const {status, id} = req.body;
        if(!status || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedRow = await UserData.update({status}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateDateBirth(req, res, next) {
        const {date_birth, id} = req.body;
        if(!date_birth || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedRow = await UserData.update({date_birth}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateCity(req, res, next) {
        const {city, id} = req.body;
        if(!city || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedRow = await UserData.update({city}, {where: { user_id: id }});
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
            const updatedRow = await UserData.update({image: fileName}, {where: { user_id: id }});
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
            const updatedRow = await UserData.update({panoramaImage: fileName}, {where: { user_id: id }});
            return res.json(updatedRow)
        }
        catch (e) {
            return res.json('Ошибка' + e.message)
        }
    }
}

module.exports = new userDataController();