
'use strict'

const moment = require('moment')
const getModel = require('../model.js')

// 数组去重
const _unique = arr => {
  const len = arr.length

  let result = []
  let hash = {}

  for (let i = 0; i < len; i += 1) {
    const elem = arr[i]

    if (!hash[elem]) {
      result.push(elem)
      hash[elem] = true
    }
  }

  return result
}

module.exports = dbName => {
  const Sm = getModel(dbName, 'sm')
  const SetPlace = getModel(dbName, 'setplace')
  const Kanban = getModel(dbName, 'kanban')

  return {
    async getKbSms (gotoday) {
      const _gt = moment().isAfter(gotoday) ? 1 : 0

      const sms = await Sm.find({ 'flight.flightDate': moment(gotoday), smStatus: { $gt: _gt } }, {
        team: 1,
        smType2: 1,
        operator: 1,
        flight: 1,
        smRealNumber: 1,
        smTimeSpace: 1,
        smAgencyFund: 1,
        smPayment: 1,
        phoneMsgStatus: 1,
        serverMan: 1,
        insurance: 1,
        smStatus: 1
      })

      const flightNumArr = sms.map(function (item) {
        return item.flight.flightNum.substr(0, 2)
      })
      const flightNumIds = _unique(flightNumArr)
      const setPlaces = await SetPlace.find(
        { airCode: { $in: flightNumIds } },
        { airCode: 1, place: 1 }
      )

      const smIds = sms.map(item => {
        return item._id
      })
      const kanbans = await Kanban.find(
        { sm: { $in: smIds } },
        {
          _id: 0,
          sm: 1,
          djpState: 1,
          flightState: 1,
          flyingStatusClass: 1,
          smAgencyFundState: 1,
          smPaymentState: 1,
          serverState: 1,
          smSetPlace: 1,
          djpNote: 1,
          serverNote: 1,
          flight_gai: 1,
          historys: 1,
          news: 1,
          wxServerState: 1
        }
      )

      return ({
        success: 1,
        data: {
          sms: sms,
          kanbans: kanbans,
          setPlaces: setPlaces
        }
      })
    }
  }
}
