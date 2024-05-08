const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
    const authHeaders = req.headers.authorization || req.headers.Authorization;
    if (!authHeaders?.startsWith(`Bearer `)) return res.sendStatus(409);
    const token = authHeaders.split(" ")[1];

    if (!token) {
        return res.sendStatus(409);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded?.userInfo?.userId;
        req.role = decoded?.userInfo?.role;
        req.email = decoded?.userInfo?.email;
        next();
    });
};

module.exports = verifyJwt;
