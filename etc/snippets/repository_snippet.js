const snippet = `
const BaseRepository = require("../../commons/base_repository");
const __nameCapital__Schema = require("./__nameLowerCase___schema");

module.exports = class __nameCapital__Repository extends BaseRepository {
  constructor() {
    super("__nameLowerCase__", __nameCapital__Schema.getSchema());
  }
};
`;

module.exports = snippet;
