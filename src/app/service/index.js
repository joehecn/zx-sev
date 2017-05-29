
'use strict'

const createError = require('http-errors')
const getModel = require('../model.js')
const { nameNotExist, passwordNotMatch } = require('../err.js')

exports.dengjipai = dbName => {
  const Dengjipai = getModel(dbName, 'dengjipai')

  return {
    checkUser: async (name, password) => {
      const res = await Dengjipai.findOne({ name }, { _id: 0, name: 1, password: 1 })

      if (res === null) throw createError(401, nameNotExist)
      if (res.password !== password) throw createError(401, passwordNotMatch)
    }
  }
}
