const mysql = require("mysql");
const uuidv1 = require("uuid/v1");
const AbstractChecker = require("./../utils/abstract_checker");
const SchemaConverter = require("./../utils/schema_converter");
const DatabaseConnection = require("./database_connection");

module.exports = class BaseRepository {
  constructor(tableName,schema) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._tableName = tableName;
    this._schema =  schema;
    this._db = new DatabaseConnection();
  }

  generateId() {
    return uuidv1();
  }

  formatSql(query, valueArray) {
    return mysql.format(query, valueArray);
  }

  async execute(query) {
    return await this._db.executeQuery(query);
  }

  async getAll(queryParams) {
    let limit = queryParams.pageSize || 100;

    let keys = SchemaConverter.getSchemaKeys(this._schema);
    let setKeys = [], values = [];    

    for(let k of keys){
      if(queryParams.hasOwnProperty(k)){
        setKeys.push(k);
        values.push(queryParams[k]);
      }
    }
    let where =setKeys.length>0? this.formatSql(
      ` where ${setKeys.join("=? AND ")}=? `,
      values
    ) : '';

    let query = mysql.format(
      `select * from ${this._tableName} ${where} order by updated_at desc limit ?`,
      [limit]
    );
    return await this.execute(query);
  }

  async getCount() {
    let query = mysql.format(`select count(*) from ${this._tableName}`);
    return await this.execute(query);
  }

  async create(entity) {
    let keys = SchemaConverter.getSchemaKeys(this._schema);
    let id = this.generateId();
    let setKeys = ["id"];
    let values = [id];
    for(let k of keys){
      if(entity.hasOwnProperty(k)){
        setKeys.push(k);
        values.push(entity[k]);
      }
    }
    let query = this.formatSql(
      `insert into ${
      this._tableName
      } (${setKeys.join(",")}) values(${new Array(setKeys.length).join("?,")}?)`,
      values
    );
    let result = await this.execute(query);
    if (result && result.affectedRows === 1) {
      return {
        entity: this._tableName,
        id,
        status: "created"
      }
    }

    return null;
  }

  async update(id, entity) {
    let keys = SchemaConverter.getSchemaKeys(this._schema);
    let setKeys = [];
    let values = [];
    for(let k of keys){
      if(entity.hasOwnProperty(k)){
        setKeys.push(`${k}=?`);
        values.push(entity[k]);
      }
    }
    values.push(id);
    let query = this.formatSql(
      `update ${
        this._tableName
      } set ${setKeys.join(',')} where id =?`,
      values
    );

    let result = await this.execute(query);
    if (result && result.affectedRows === 1) {
      return {
        entity:this._tableName,
        id,
        status: "updated"        
      }
    }

    return null;
  }

  async get(id) {
    let query = mysql.format(`select * from ${this._tableName} where id=?`, [
      id
    ]);
    let result = await this.execute(query);
    if (result && result.length == 1) {
      return result[0];
    }

    return null;
  }

  async delete(id) {
    let query = mysql.format(`delete from ${this._tableName} where id=?`, [id]);
    let result = await this.execute(query);
    if (result && result.affectedRows === 1) {
      return {
        entity: this._tableName,
        id,
        status: "deleted"
      };
    }

    return null;
  }
};
