
'use strict'

// 登机牌用户
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DengjipaiSchema = new Schema({
  name: {
    unique: true,
    type: String
  }, // 用户
  password: String, // 口令
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

DengjipaiSchema.pre('save', next => {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

module.exports = DengjipaiSchema
