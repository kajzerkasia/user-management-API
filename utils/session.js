const hmacSha512 = require('crypto-js/hmac-sha512');
const base64 = require('crypto-js/enc-base64');

const createHash = (input) => base64.stringify(hmacSha512(input, process.env.APP_PRIVATE_KEY));
const appSecretHash = createHash(process.env.APP_SECRET);
const sessionCookieName = 'sessionId';

const validateSession = (cookies) => {
    return cookies[sessionCookieName] === appSecretHash
};

const sessionMiddleware = async (req, res, onValidSession) => {
    if (validateSession(req.cookies)) {
        await onValidSession();
    } else {
        res.status(401).redirect('/login');
    }
};

module.exports = {
    createHash,
    appSecretHash,
    sessionCookieName,
    validateSession,
    sessionMiddleware
};