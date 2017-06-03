
'use strict'

// https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')

exports.validatorReplaceFirstUpper = str => {
  return str.replace(/(\w)/, v => {
    return v.toUpperCase()
  })
}

exports.validatorObjectId = str => {
  return checkForHexRegExp.test(str)
}
