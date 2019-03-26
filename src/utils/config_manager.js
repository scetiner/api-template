
/**
 *  Config manager provides loading all configurations when application is startup. Some configs gathered from environment variables, 
 *  some are from static fields. When a modicifation needed, if you think, a variable is static please you should add it as static, not use ENVIRONMENT_VARIABLES!!!! 
 */
module.exports = class ConfigManager {
    constructor() {
        this.mysql = this._getMysqlConfigs();
        this.authentication = this._getBasicAuthenticationConfigs();
    }

    _getMysqlConfigs() {
        let mysql = {};
        mysql.database = "entity_service";
        mysql.connectionLimit = process.env.ENTITY_SERVICE_MYSQL_CONNECTION_LIMIT || 10;
        mysql.queueLimit = process.env.ENTITY_SERVICE_MYSQL_QUEUE_LIMIT || 10;
        mysql.host = process.env.ENTITY_SERVICE_MYSQL_HOST || "localhost";
        mysql.port = process.env.ENTITY_SERVICE_MYSQL_PORT || 3306;
        mysql.user = process.env.ENTITY_SERVICE_MYSQL_USER || "root";
        mysql.password = process.env.ENTITY_SERVICE_MYSQL_PASSWORD || "super_Secret";
        mysql.timezone = "utc";
        return mysql;
    }

    _getBasicAuthenticationConfigs() {
        let authentication = { admin: {
            username:process.env.ENTITY_SERVICE_ADMIN_USERNAME || "adminUser",
            password:process.env.ENTITY_SERVICE_ADMIN_PASSWORD || "whatAc00ls3cret"
        }};
        return authentication;
    }

    getConfigurations() {
        return {
            mysql: this.mysql,
            authentication: this.authentication,
            logLevel: process.env.LOG_LEVEL || "debug",
            rejectUnauthorized: process.env.REQUEST_REJECT_UNAUTHORIZED == "true" ? true : false,
            listenPort: process.env.PORT || 8085
        }
    }
}