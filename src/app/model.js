
'use strict'

/**
 * mongoose model 模块
 * @module app/model
 * require me: schemas/*, conn, zxutil
 */

/**
 * 动态存放所有 model key-value 结构，通过 [dbName][schemaName] 获取 Model
 *
 * @type {Object}
 * @property {Object} dbName
 * @property {Model}  dbName.schemaName
 * @property {Object} ...
 * @property {Model}  ......
 */

/* 数据结构
   models = {
     hz: {
       user: Model,
       ...
     },
     ...
   }
 */

const getConn = require('./conn.js')
const { validatorReplaceFirstUpper } = require('./zxutil.js')

let models = {}

/**
 * 创建 Model
 *
 * @param   {String} dbName     - 数据库名称
 * @param   {String} schemaName - schema
 * @returns {Model}  model      - mongoose model
 * @private
 */

const _createModel = (dbName, schemaName) => {
  let Schema = require('./schema/' + schemaName)

  let c = getConn(dbName)

  // 首字母大写
  return c.model(validatorReplaceFirstUpper(schemaName), Schema)
}

/**
 * 获取 Model
 *
 * @param   {String} dbName     - 数据库名称
 * @param   {String} schemaName - schema
 * @returns {Model}  model      - mongoose model
 */

module.exports = (dbName, schemaName) => {
  let md

  if (models[dbName]) {
    if (models[dbName][schemaName]) {
      return models[dbName][schemaName]
    } else {
      md = _createModel(dbName, schemaName)
      models[dbName][schemaName] = md

      return md
    }
  } else {
    md = _createModel(dbName, schemaName)
    models[dbName] = {}
    models[dbName][schemaName] = md

    return md
  }
}
