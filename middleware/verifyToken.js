const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not allowed" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Token not valid" });
        }

        req.userId = payload.id;
        req.isAdmin = payload.isAdmin;
        next();
    });
};

module.exports = verifyToken;
