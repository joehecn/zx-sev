
/**
 * mongoose sev 模块
 * @module app/sev
 * require me: service/*
 */
'use strict'

/**
 * 动态存放所有 sev key-value 结构，通过 [dbName][sevName] 获取 Service
 *
 * @type {Object}
 * @property {Object} dbName
 * @property {Service}  dbName.sevName
 * @property {Object} ...
 * @property {Service}  ......
 */

/* 数据结构
  sevs = {
    hz: {
      dengjipai: Service,
      ...
    },
    ...
  }
*/
let sevs = {}

/**
 * 创建 Service
 *
 * @param   {String}     dbName     - 数据库名称
 * @param   {String}     sevName   - sev
 * @returns {Service} sev       - mongoose sev
 * @private
 */
const _createSev = function (dbName, sevName) {
  const createSev = require('./service/' + sevName)
  return createSev(dbName)
}

/**
 * 获取 Service
 *
 * @param   {String}     dbName     - 数据库名称
 * @param   {String}     sevName   - sev
 * @returns {Service} sev       - mongoose sev
 */
module.exports = (dbName, sevName) => {
  let sev

  if (sevs[dbName]) {
    if (sevs[dbName][sevName]) {
      return sevs[dbName][sevName]
    } else {
      sev = _createSev(dbName, sevName)
      sevs[dbName][sevName] = sev

      return sev
    }
  } else {
    sev = _createSev(dbName, sevName)
    sevs[dbName] = {}
    sevs[dbName][sevName] = sev

    return sev
  }
}
