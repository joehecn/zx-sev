
'use strict'

// 登机牌
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var DjpSchema = new Schema({
  sm: {
    type: ObjectId,
    ref: 'Sm'
  },
  name: String,                                  // 用户
  isDownload: { type: Boolean, default: false }, // 是否已导出
  isPrint: { type: Boolean, default: false },    // 是否已办理
  djpNote: { type: String, default: '' },        // 注意事项
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

DjpSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

module.exports = DjpSchema
