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

        if(report_type !== "scam" && report_type !== "spam" && report_type !== "prohibitedGoods" && report_type !== "fuelingConflict") {
            return next(ApiError.badRequest('Такого типа не существует'));
        }

        if(user_id !== req.decodedToken.email) {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const report = await Reports.create({user_id, report_type, reported_type, reported_id});
        return res.json(report)
    }
    async deleteById(req, res, next) {
        const {id} = req.body;
        if(!id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'));
        }

        if(req.decodedToken.email !== "OWNER") {
            return next(ApiError.badRequest('Ты чего тут удумал еблоид?'));
        }

        const updatedRows = await Reports.destroy({where: { id: id }});
        return res.json(updatedRows)
    }
}

module.exports = new ReportController();