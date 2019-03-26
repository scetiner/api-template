const Joi = require("joi");

/**
 * SchemaConverter is a utility class that is used for validation needs of 
 * test and repository modules
 */
module.exports = class SchemaConverter {
  /**
   * Extracts and returns the keys of the Joi Schema
   * @param {Array: string} schema Joi Schema to extract keys
   */
  static getSchemaKeys(schema) {
    let keys = Joi.describe(schema).children;
    return Object.keys(keys).map(k => k);
  }
};