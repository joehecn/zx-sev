
'use strict'

const createError = require('http-errors')
const getModel = require('../model.js')
const { CITY_DB } = require('../zxutil.js')
const User = getModel('auth', 'user')

getModel('auth', 'company')

const { userNameNotExist, roleDisableLogin, statusInReviewLogin,
  categoryUnauthorized, passwordNotMatch } = require('../err.js')

module.exports = {
  async login (userName, password, isKB) {
    const res = await User.findOne(
      { userName },
      { company: 1, name: 1, role: 1, status: 1, password: 1 }
    ).populate(
      'company',
      { category: 1, city: 1 }
    )
    // console.log(res)
    if (res === null) throw createError(401, userNameNotExist)
    if (res.role === 0) throw createError(401, roleDisableLogin)
    if (!res.status) throw createError(401, statusInReviewLogin)

    if (isKB && res.company.category !== 30) throw createError(401, categoryUnauthorized)

    const isMatch = await res.comparePassword(password)
    if (!isMatch) throw createError(401, passwordNotMatch)

    const city = res.company.city
    const dbname = CITY_DB[city]

    return {
      _id: res._id,
      name: res.name,
      city,
      dbname
    }
  },

  async initUser (_id) {
    const res = await User.findOne(
      { _id },
      { company: 1, role: 1, status: 1 }
    ).populate(
      'company',
      { category: 1, city: 1 }
    )

    if (res.role === 0) throw createError(401, roleDisableLogin)
    if (!res.status) throw createError(401, statusInReviewLogin)

    return res
  }
}
