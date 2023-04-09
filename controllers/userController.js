const uuid = require('uuid');
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Users, Post, Messages, Comments, Friendship, GroupUsers, Group, Inbox, Reports, UserData, Likes} = require('../models/models')
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
        if(!email || !password) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'))
        }
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
    async getByEmail(req, res, next) {
        const {email} = req.query;
        if(!email) {
            return next(ApiError.internal('Не указан параметр запроса')) 
        }  
        const user = await Users.findOne({where:{email: email}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден')) 
        }
        return res.json({unique_id: user.unique_id, name: user.name, surname: user.surname, email: user.email, role: user.role, id: user.id, createdAt: user.createdAt});
    }
    async getById(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(ApiError.internal('Не указан параметр запроса')) 
        }  
        const user = await Users.findOne({where:{id: id}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден')) 
        }
        return res.json(user);
    }
    async findAllByName(req, res, next) {
        const {queryParameter} = req.query;
        if(!queryParameter) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const users = await Users.findAll({where:{[Op.or]: [{name: {[Op.substring]: queryParameter.charAt(0).toUpperCase() + queryParameter.slice(1)}}, {surname: {[Op.substring]: queryParameter.charAt(0).toUpperCase() + queryParameter.slice(1)}}]}})
        return res.json(users);
    }
    async getAll(req, res) {
        const {ids} = req.query;
        if(!ids) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        let {limit, page} = req.query;
        limit = limit || 10;
        page = page || 1;
        let offset = page * limit - limit; 
        let users;
        if(JSON.parse(ids).length > 0)
            users = await Users.findAndCountAll({where: {[Op.not]: [{email: JSON.parse(ids)}]}, limit, offset});
        else
            users = await Users.findAndCountAll({limit, offset});

        return res.json(users);
    }
    async changeUserRole(req, res, next) {
        const {role, user_id} = req.body;
        if(!role || !user_id) {
            return next(ApiError.badRequest('Не задано одно из обязательных полей'))
        }
        const updatedUser = await Users.update({role}, {where: {email: user_id}})
        return res.json(updatedUser);
    }
    async deleteUserByEmail(req, res, next) {
        const {email} = req.body;
        if(!email) {
            return next(ApiError.badRequest('Не задано обязательное поле'));
        }
        const user = await Users.destroy({where: {email: email}})
        const posts = await Post.destroy({where: {post_handler_id: email}})
        const comments = await Comments.destroy({where: {user_id: email}})
        const friendShips = await Friendship.destroy({where: {[Op.or]: [{profile_from: email}, {profile_to: email}]}})
        const groupUsers = await GroupUsers.destroy({where: {user_id: email}})
        const groups = await Group.destroy({where: {owner_id: email}})
        const inboxes = await Inbox.destroy({where: {inbox_holder_user_id: email}})
        const likes = await Likes.destroy({where: {user_id: email}})
        const messages = await Messages.destroy({where: {outgoing_id: email}})
        const userData = await UserData.destroy({where: {user_id: email}})
        const reports = await Reports.destroy({where: {user_id: email}})
        return res.json(user);
    }
}

module.exports = new UserController();