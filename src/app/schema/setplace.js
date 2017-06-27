/**
 * setplace Schema 模块
 * @module app/schemas/setplace
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const SetPlaceSchema = new Schema({
  city: String,
  airlineCompany: String,  // 航空公司
  airCode: String,         // 代码 验证 大写或数字，必填 两位
  airTerminal: String,     // 候机楼
  checkInIsland: String,   // 值机岛
  checkInCounter: String,  // 值机柜台
  place: String,           // 集合地点 必填
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

SetPlaceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

// 静态方法
SetPlaceSchema.statics = {
  findOneByAirCode: function (city, airCode, cb) {
    return this.findOne({ city: city, airCode: airCode })
      .exec(cb)
  }
}

module.exports = SetPlaceSchema
