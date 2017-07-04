
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

const _provinces = {
  '广东': {
    '深圳': { city: 'sz', places: ['6', '2', '0'] },
    '广州': { city: 'gz', places: ['13'] }
  },
  '浙江': {
    '杭州': { city: 'hz', places: ['7', '11'] }
  }
}

// '广东': {
//   '深圳': 'sz',
//   '广州': 'gz'
// },
// '浙江': {
//   '杭州': 'hz'
// }
exports.PROVINCE_CITY = (_provinces => {
  let obj = {}

  for (let key1 in _provinces) {
    if (_provinces.hasOwnProperty(key1)) {
      let province = _provinces[key1]
      let _citys = {}
      for (let key2 in province) {
        if (province.hasOwnProperty(key2)) {
          _citys[key2] = province[key2].city
        }
      }
      obj[key1] = _citys
    }
  }

  return obj
})(_provinces)

// {
//   '深圳': { city: 'sz', places: ['6', '2', '0'] }
//   ...
// }
const _citys = (_provinces => {
  let obj = {}

  for (let key1 in _provinces) {
    if (_provinces.hasOwnProperty(key1)) {
      let province = _provinces[key1]
      for (let key2 in province) {
        if (province.hasOwnProperty(key2)) {
          obj[key2] = province[key2]
        }
      }
    }
  }

  return obj
})(_provinces)

let _cityDb = {}
let _cityPlaces = {}

;(_citys => {
  for (let key in _citys) {
    if (_citys.hasOwnProperty(key)) {
      _cityDb[key] = _citys[key].city
      _cityPlaces[key] = _citys[key].places
    }
  }
})(_citys)

// {
//   '深圳': 'sz',
//   ...
// }
exports.CITY_DB = _cityDb

// {
//   '深圳': ['6', '2', '0'],
//   ...
// }
exports.CITY_PLACES = _cityPlaces

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
