const uuid = require('uuid');
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Users} = require('../models/models')
const { Op } = require("sequelize");

const generateJwt = (id, email, role, unique_id, name, surname) => {
    return jwt.sign(
        {id, email, role, unique_id, name, surname},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role, name, surname} = req.body;
        if(!email || !password || !name || !surname) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'))
        }
        const candidate = await Users.findOne({where: {email}})
        if(candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует')) 
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const userUniqueId = uuid.v4();
        const user = await Users.create({email, role, password: hashPassword, unique_id: userUniqueId, name, surname})
        const token = generateJwt(user.id, user.email, user.role, user.unique_id, user.name, user.surname);
        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await Users.findOne({where:{email}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден')) 
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Неверный пароль')) 
        }
        const token = generateJwt(user.id, user.email, user.role, user.unique_id, user.name, user.surname)
        return res.json({token})
    } 
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.unique_id, req.name, req.surname)
        return res.json({token})    
    }
    async getByEmail(req, res) {
        const {email} = req.query;
        if(!email) {
            return next(ApiError.internal('Не указан параметр запроса')) 
        }  
        const user = await Users.findOne({where:{email: email}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден')) 
        }
        return res.json({unique_id: user.unique_id, name: user.name, surname: user.surname, email: user.email, role: user.role, id: user.id});
    }
    async findAllByName(req, res) {
        const {queryParameter} = req.query;
        const users = await Users.findAll({where:{[Op.or]: {name: {[Op.substring]: queryParameter}}, surname: {[Op.substring]: queryParameter}}})
        return res.json(users);
    }
    async getAll(req, res) {
        let limit = 20; 
        const users = await Users.findAll({limit});
        return res.json(users);
    }
}

module.exports = new UserController();