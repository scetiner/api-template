const Logger = require("./../utils/logger");
const BasicAuth = require("basic-auth");

module.exports = class BaseAuthMiddleWare {
    constructor() {
        this._logger = new Logger(`basic-authentication-middleware`).getLogger();
    }

    checkAdminAuthenticaton(user) {
        if (user && user.name == global.conf.authentication.admin.username && user.pass == global.conf.authentication.admin.password) {
            return true;
        }
        return false;
    }

    async checkAuthentication(req, res, next) {
        try {
            var user = BasicAuth(req);
            if (this.checkAdminAuthenticaton(user)) {
                return next();
            }
            this._logger.error("Authentication failed. Check your credentials to continue");
            return res.status(401).send(`Authentication failed. Check your credentials to continue`);
        } catch (error) {
            this._logger.error(`Something went wrong while checking authentication ${error}`);
            return res.status(500).send(`Something went wrong while checking authentication`);
        }
    }
}