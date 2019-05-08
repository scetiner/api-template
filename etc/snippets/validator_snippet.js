const snippet = `
const BaseValidator = require("../../commons/base_validator");
const __nameCapital__Schema = require("./__nameLowerCase___schema");

module.exports = class __nameCapital__Validator extends BaseValidator {
    constructor() {
        super("__nameLowerCase__", __nameCapital__Schema.getSchema());
    }
};
`;

module.exports = snippet;
