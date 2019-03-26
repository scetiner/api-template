const ErrorHandler = require("./../utils/error_handler");
const Logger = require("./../utils/logger");

module.exports = class BaseValidator {
    constructor(validatorName, schema) {        
        this._validatorName = validatorName;
        this._schema = schema;
        this._logger = new Logger(`validator-${this._validatorName}`).getLogger();
    }

    async validate(req, res, next) {
        try{
            const validationResult = this._schema.validate(req.body)
            if (validationResult.error) {
                ErrorHandler.handleError(validationResult.error);
            }
        }
        catch(err){
            return res.status(400).send(`Invalid validation results: ${err.message}`);
        }
        return next()
    }
}