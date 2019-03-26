var mysql = require("mysql");
const Logger = require("./../utils/logger");

/**
 * DatabaseConnection is the database worker class for the application.
 * It is implemented as Singleton to keep connection limit safe
 */
module.exports = class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }

        this._connectionPool = null;
        this._logger = new Logger("database_connection").getLogger();
        this._initDBAccess();
        DatabaseConnection.instance = this;
    }
    _initDBAccess() {
        if (this._connectionPool === null) {
            this._connectionPool = mysql.createPool({
                connectionLimit: global.conf.mysql.connectionLimit,
                host: global.conf.mysql.host,
                port: global.conf.mysql.port,
                user: global.conf.mysql.user,
                password: global.conf.mysql.password,
                database: global.conf.mysql.database,
                debug: false,
                multipleStatements: true,
                timezone: global.conf.mysql.timezone
            });
        }
    }
    _getConnection(cb, query, groupBy) {
        this._connectionPool.getConnection((err, connection) =>{
            if (err) {
                if (connection) {
                    connection.release();
                }
                this._logger.error("Error in connection database ", err);
                cb(false, []);
                return;
            }

            var errorCallback = (err)=> {
                this._logger.error("Error in connection database", err);
                try {
                    cb(false, []);
                } catch (error) {
                    this._logger.error(
                        "callback error after connection lost in mysql connection : ",
                        error
                    );
                }
            };

            connection.on("error", errorCallback);

            connection.query(query, (err, rows, fields) =>{
                connection.removeListener("error", errorCallback);
                connection.release();
                if (!err) {
                    if (groupBy) {
                        var grouped = us.groupBy(rows, (d) =>{
                            return d[groupBy];
                        });

                        rows = grouped;
                    }
                    this._logger.debug("Executed SQL Query: ", query);
                    cb(true, rows);
                } else {
                    this._logger.error("Error of Query: " + query);
                    this._logger.error(err);
                    cb(false, []);
                }
            });
        });
    }

    executeQuery(query) {
        return new Promise((resolve, reject) => {
            if (this._connectionPool === null) {
                return reject(new Error("Database connection is not available."));
            }

            this._getConnection((status, data) => {
                if (status) {
                    return resolve(data);
                }
                return reject(data);
            }, query);
        });
    }
};
