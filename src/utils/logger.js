const fs = require('fs');
const projectConf = require("./../../package.json");
const log4js = require('log4js');

module.exports = class Logger {    

    constructor(name) {
        this.name = name;
    }

    static _getConf(){
        return {
          appenders: {
            console: {
              type: "console"
            },
            access: {
              type: "dateFile",
              filename: "log/access_" + projectConf.version + ".log",
              pattern: "-yyyy-MM-dd",
              category: "http"
            },
            app: {
              type: "file",
              filename: "log/app_" + projectConf.version + ".log",
              maxLogSize: 10485760,
              numBackups: 3
            },
            errorFile: {
              type: "file",
                filename: "log/errors_" + projectConf.version + ".log",
            },
            errors: {
              type: "logLevelFilter",
              level: "ERROR",
              appender: "errorFile"
            }
          },
          categories: {
            default: {
              appenders: ["app", "errors", "console"],
              level: "DEBUG"
            },
            http: {
              appenders: ["access"],
              level: "DEBUG"
            }
          }
        };
    }

    _stringifyArguments(args) {
        let str = '';
        if (args && args.length > 0) {
            for (let i = 0; i < args.length; i += 1) {
                if (args[i] && typeof args[i] === 'object') {
                    const stringifiedObject = JSON.stringify(args[i]);
                    str += stringifiedObject === '{}' ? args[i].toString() : stringifiedObject;
                } else if (args[i]) {
                    str += ` ${args[i]}`;
                }
            }
        }
        return str;
    }

    static initializeLogger(logPath) {
        /**
         * make a log directory, just in case it isn't there.
         */
        try {
            fs.mkdirSync(logPath);
        } catch (e) {
            if (e.code !== 'EEXIST') {
                console.error('Could not set up log directory, error was: ', e);
            }
        }

        log4js.configure(Logger._getConf());
    }

    static getHttpLogger() {
        return log4js.getLogger('http');
    }

    getLogger() {
        const closureLogger = log4js.getLogger(this.name);
        const self = this;
        if (global.conf.logLevel) {
            closureLogger.level = global.conf.logLevel;
        }
        return {
            error(...args) {
                closureLogger.error(self._stringifyArguments(args));
            },
            warn(...args) {
                closureLogger.warn(self._stringifyArguments(args));
            },
            info(...args) {
                closureLogger.info(self._stringifyArguments(args));
            },
            debug(...args) {
                closureLogger.debug(self._stringifyArguments(args));
            }
        };
    }

    convertToString(data) {
        try {
            return JSON.stringify(data);
        } catch (err) {
            log4js.getLogger('logger').error('Error occured during converting JSON to string:', err);
            return data;
        }
    }

    convertToJson(data) {
        try {
            if (data instanceof Object === false) {
                return JSON.parse(data);
            }
            return data;
        } catch (err) {
            log4js.getLogger('logger').error('Error occured during converting data to JSON:', err);
            return data;
        }
    }
}