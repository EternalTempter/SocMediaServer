const {UserData} = require('../models/models');
const ApiError = require('../error/ApiError')

class userDataController {
    async getOne(req, res) {
        const {id} = req.query;
        const userData = await UserData.findOne({where: {user_id: id}});
        return res.json(userData);
    }
    async setDefaultData(req, res) {
        const {id} = req.query;
        const data = await UserData.create({user_id: id, date_birth: '', status: '', city: ''})
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
}

module.exports = new userDataController();