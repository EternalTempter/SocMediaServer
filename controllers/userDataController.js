const {UserData, Users} = require('../models/models');
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

        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const data = await UserData.create({user_id: id, date_birth: '', status: '', city: '', image: 'none', panoramaImage: 'none'})
        return res.json(data);
    }
    async updateStatus(req, res, next) {
        const {status, id} = req.body;
        if(!status || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(status.length > 100 || status.length < 1) {
            return next(ApiError.badRequest('Статус должен быть от 1 до 100 символов'));
        }

        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await UserData.update({status}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateDateBirth(req, res, next) {
        const {date_birth, id} = req.body;
        if(!date_birth || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        let destroyedDateBirth = date_birth.split('.');
        if(
            (destroyedDateBirth.length !== 3) || 
            (destroyedDateBirth[0].length <= 0 || destroyedDateBirth[0].length >= 3) ||
            (destroyedDateBirth[1].length <= 0 || destroyedDateBirth[1].length >= 3) ||
            (destroyedDateBirth[2].length <= 0 || destroyedDateBirth[2].length >= 5)
        ) {
            return next(ApiError.badRequest('Неверный формат даты рождения'));
        }
        if(
            (destroyedDateBirth[0] > 31 || destroyedDateBirth[0] <= 0) ||
            (destroyedDateBirth[1] > 12 || destroyedDateBirth[1] <= 0) ||
            ((destroyedDateBirth[2] > (new Date()).getFullYear()) || (destroyedDateBirth[2] <= (new Date()).getFullYear() - 100))
        ) {
            return next(ApiError.badRequest('Неверный формат даты рождения'));
        }
        
        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await UserData.update({date_birth}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateCity(req, res, next) {
        const {city, id} = req.body;
        if(!city || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(city.length > 60 || city.length < 1) {
            return next(ApiError.badRequest('Город должен быть от 1 до 60 символов'));
        }
        
        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await UserData.update({city}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateName(req, res, next) {
        const {name, id} = req.body;
        if(!name || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(name.length > 20 || name.length < 1) {
            return next(ApiError.badRequest('Имя должно быть от 1 до 20 символов'));
        }
        
        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await Users.update({name}, {where: { email: id }});
        return res.json(updatedRow)
    }
    async updateSurname(req, res, next) {
        const {surname, id} = req.body;
        if(!surname || !id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        
        if(surname.length > 20 || surname.length < 1) {
            return next(ApiError.badRequest('Фамилия должна быть от 1 до 20 символов'));
        }

        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRow = await Users.update({surname}, {where: {email: id }});
        return res.json(updatedRow)
    }
    async updateImage(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        
        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        try {
            const {img} = req.files;
            
            if(img.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }

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
        
        if(id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        try {
            const {img} = req.files;

            if(img.size > 10485760) {
                return next(ApiError.badRequest('Слишком большой размер картинки'));
            }
            
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