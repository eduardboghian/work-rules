const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (typeof token !== 'undefined') {
        token = token.replace('Bearer ', '');
        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = { verifyToken };
