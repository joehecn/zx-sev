
'use strict'

const moment = require('moment')
const createError = require('http-errors')
const getModel = require('../model.js')
const { nameNotExist, passwordNotMatch } = require('../err.js')

exports.dengjipai = dbName => {
  const Dengjipai = getModel(dbName, 'dengjipai')
  const Djp = getModel(dbName, 'djp')
  const Sm = getModel(dbName, 'sm')

  return {
    checkUser: async (name, password) => {
      const res = await Dengjipai.findOne({ name }, { _id: 0, name: 1, password: 1 })

      if (res === null) throw createError(401, nameNotExist)
      if (res.password !== password) throw createError(401, passwordNotMatch)
    },

    list: async (name, m, isDate) => {
      let match
      if (isDate) {
        match = m
      } else {
        match = {
          $gte: m,
          $lt: moment(m).add(1, 'M')
        }
      }

      const sms = await Sm.find(
        { 'flight.flightDate': match },
        { _id: 1 }
      )

      const smids = sms.map(item => {
        return item._id
      })

      const res = await Djp.find(
        { name: name, sm: { $in: smids } },
        { sm: 1, name: 1, isDownload: 1, isPrint: 1, djpNote: 1 }
      ).populate(
        { path: 'sm',
          select: '_id flight smRealNumber',
          match: {
            'flight.flightDate': match
          }
        }
      )

      console.log(res.length)
      return res
    }
  }
}
