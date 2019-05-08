const snippet = `
const { to } = require("await-to-js");
const BaseController = require("../../commons/base_controller");
const ErrorHandler = require('../../utils/error_handler');
const __nameCapital__Repository = require("./__nameLowerCase___repository");

module.exports = class __nameCapital__Controller extends BaseController {
  constructor() {
    super("__nameLowerCase__", new __nameCapital__Repository());
  }
};
`;


module.exports = snippet;