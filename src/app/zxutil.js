
'use strict'

exports.validatorReplaceFirstUpper = str => {
  return str.replace(/(\w)/, v => {
    return v.toUpperCase()
  })
}
