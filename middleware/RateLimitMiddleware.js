const rateLimit = require('express-rate-limit');

module.exports = {
    PostLimiter: rateLimit({
        windowMs: 24 * 60 * 60 * 1000,
        max: 25, 
        message: 'Лимит постов в день превышен',
    }),
    DefaultLimiter: rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 400, 
        message: 'Пошел нахуй дудосер ебаный',
    }),
    MessageLimiter: rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 450, 
        message: 'Перестань дрочить сервер, заебал',
    }),
}