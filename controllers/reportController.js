const ApiError = require('../error/ApiError')
const {Reports} = require('../models/models')

class ReportController {
    async getAll(req, res, next) {
        let limit = 15;
        const reports = await Reports.findAll({where: {}, limit})
        return res.json(reports)
    }
    async create(req, res, next) {
        const {user_id, report_type, reported_type, reported_id} = req.body
        if(!user_id || !report_type || !reported_type || !reported_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const report = await Reports.create({user_id, report_type, reported_type, reported_id});
        return res.json(report)
    }
    async deleteById(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }
        const updatedRows = await Reports.destroy({where: { id: id }});
        return res.json(updatedRows)
    }
}

module.exports = new ReportController();