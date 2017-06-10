
'use strict'

// const err = require('./err.js')

// https://github.com/mongodb/js-bson/blob/master/lib/bson/objectid.js
// const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')

// exports.errToClient = (err => {
//   let obj = {}

//   for (let key in err) {
//     if (err.hasOwnProperty(key)) {
//       obj[err[key][0]] = err[key][1]
//     }
//   }

//   return obj
// })(err)

const _provinceCity = exports.PROVINCE_CITY = {
  '广东': {
    '深圳': 'sz',
    '广州': 'gz'
  },
  '浙江': {
    '杭州': 'hz'
  }
}

// {
//   '深圳': 'sz',
//   ...
// }
const _cityDb = exports.CITY_DB = (_provinceCity => {
  let obj = {}

  for (let key1 in _provinceCity) {
    if (_provinceCity.hasOwnProperty(key1)) {
      let cityObj = _provinceCity[key1]
      for (let key2 in cityObj) {
        if (cityObj.hasOwnProperty(key2)) {
          obj[key2] = cityObj[key2]
        }
      }
    }
  }

  return obj
})(_provinceCity)

// {
//   'sz': '深圳',
//   ...
// }
exports.DB_CITY = (_cityDb => {
  let obj = {}

  for (let key in _cityDb) {
    if (_cityDb.hasOwnProperty(key)) {
      obj[_cityDb[key]] = key
    }
  }

  return obj
})(_cityDb)

exports.ygSecret = process.env.YG_SECRET || 'ygSecret'
exports.kbSecret = process.env.KB_SECRET || 'kbSecret'
exports.djpSecret = process.env.DJP_SECRET || 'djpSecret'

exports.validatorReplaceFirstUpper = str => {
  return str.replace(/(\w)/, v => {
    return v.toUpperCase()
  })
}

// exports.validatorObjectId = str => {
//   return checkForHexRegExp.test(str)
// }
