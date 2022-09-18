const {UserData} = require('../models/models');
const ApiError = require('../error/ApiError')
const uuid = require("uuid");
const path = require("path");

class userDataController {
    async getOne(req, res) {
        const {id} = req.query;
        const userData = await UserData.findOne({where: {user_id: id}});
        return res.json(userData);
    }
    async setDefaultData(req, res) {
        const {id} = req.query;
        const data = await UserData.create({user_id: id, date_birth: '', status: '', city: '', image: 'none', panoramaImage: 'none'})
        return res.json(data);
    }
    async updateStatus(req, res) {
        const {status, id} = req.body;
        const updatedRow = await UserData.update({status}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateDateBirth(req, res) {
        const {date_birth, id} = req.body;
        const updatedRow = await UserData.update({date_birth}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateCity(req, res) {
        const {city, id} = req.body;
        const updatedRow = await UserData.update({city}, {where: { user_id: id }});
        return res.json(updatedRow)
    }
    async updateImage(req, res) {
        const {id} = req.body;
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
    async updatePanoramaImage(req, res) {
        const {id} = req.body;
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