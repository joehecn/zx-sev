
'use strict'

/**
 * 数据库连接模块
 * @module app/conn
 * require: null
 */

const mongoose = require('mongoose')
const dbHost = process.env.DB_HOST || 'localhost'

/**
 * 动态存放所有数据库连接 key-value 结构，通过数据库名称获取连接
 *
 * @type {Object}
 * @property {Connection} auth  - key:数据库名称, value: 数据库连接
 * @property {Connection} sz
 * @property {Connection} gz
 * @property {Connection} hz
 * @property {Connection} ...
 */

/*
   数据库名称: auth, sz, gz, hz
   数据结构
   conns = {
     hz: mongoose.connection,
     ...
   }
 */

let conns = {}

/**
 * 创建数据库连接
 *
 * @param   {String}     dbName - 数据库名称
 * @returns {Connection} conn   - 数据库连接
 * @private
 */

const _createConn = dbName => {
  mongoose.Promise = global.Promise
  return mongoose.createConnection(dbHost, dbName)
}

/**
 * 获取数据库连接
 *
 * @param   {String}     dbName - 数据库名称
 * @returns {Connection} conn   - 数据库连接
 */

module.exports = dbName => {
  let conn

  if (conns[dbName]) {
    return conns[dbName]
  }

  conn = _createConn(dbName)
  conns[dbName] = conn
  return conn
}
