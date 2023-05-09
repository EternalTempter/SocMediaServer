const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.headers['auth-token'];

    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }

    try {
        const decodedToken = jwt.verify(token.substring(1, token.length - 1), process.env.SECRET_KEY);
        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}