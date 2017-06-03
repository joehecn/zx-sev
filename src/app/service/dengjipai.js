
'use strict'

const moment = require('moment')
const createError = require('http-errors')
const getModel = require('../model.js')
const { nameNotExist, passwordNotMatch, djpObjNotExist } = require('../err.js')

module.exports = dbName => {
  const Dengjipai = getModel(dbName, 'dengjipai')
  const Djp = getModel(dbName, 'djp')
  const Sm = getModel(dbName, 'sm')
  const Team = getModel(dbName, 'team')

  getModel(dbName, 'batch')

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

      return res
    },

    isdownload: async (_id, name, isDownload) => {
      let sn = 0
      let users = []

      const djpObj = await Djp.findOne({ _id, name }, { _id: 0, sm: 1 })

      if (djpObj === null) throw createError(400, djpObjNotExist)

      const smObj = await Sm.findOne({ _id: djpObj.sm })
      const teamObj = await Team.findOne({ _id: smObj.team })
        .populate('departureTraffics')
        .populate('returnTraffics')
        .populate('users.batchs')

      for (let j = 0, lenJ = teamObj.users.length; j < lenJ; j += 1) {
        let teamUser = teamObj.users[j]
        let user = {}
        let batchs = []

        for (let i = 0, lenI = teamUser.batchs.length;
            i < lenI; i += 1) {
          let teamUserBatch = teamUser.batchs[i]
          let batch = {}
          if (
              (
                teamUserBatch.departureTraffic._id.toString() ===
                  djpObj.sm.toString() &&
                teamUserBatch.departureTraffic.isSm === true
              ) ||
              (
                teamUserBatch.returnTraffic._id.toString() ===
                  djpObj.sm.toString() &&
                teamUserBatch.returnTraffic.isSm === true
              )
            ) {
            batch.batchNum = teamUserBatch.batchNum

            let batchInfo = []
            if (
                teamUserBatch.sendBatchNote &&
                teamUserBatch.sendBatchNote !== ''
              ) {
              batchInfo.push({
                item: '备注:' + teamUserBatch.sendBatchNote
              })
            }

            batch.batchInfo = batchInfo

            let persons = []
            let isBatchOk = false
            for (let k = 0, lenK = teamUserBatch.persons.length;
                k < lenK; k += 1) {
              let teamUserBatchPerson = teamUserBatch.persons[k]
              let person = {}
              if (teamUserBatchPerson.isSend === true) {
                if (isBatchOk) {
                  sn += 1
                  person.sn = sn
                  person.name = teamUserBatchPerson.name
                  person.cardNum = teamUserBatchPerson.cardNum
                  person.phone = teamUserBatchPerson.phone
                  person.teamPersonNote =
                    teamUserBatchPerson.sendPersonNote
                  persons.push(person)
                } else {
                  sn += 1
                  batch.sn = sn
                  batch.name = teamUserBatchPerson.name
                  batch.cardNum = teamUserBatchPerson.cardNum
                  batch.phone = teamUserBatchPerson.phone
                  batch.teamPersonNote =
                    teamUserBatchPerson.sendPersonNote

                  isBatchOk = true
                }
              }
            }

            if (isBatchOk) {
              batch.len = 1 + persons.length
              batch.persons = persons
              batchs.push(batch)
            }
          }
        }

        if (batchs.length > 0) {
          user.batchs = batchs
          users.push(user)
        }
      }

      let setData = {}

      setData.smDate =
        moment(smObj.flight.flightDate).format('YYYY-MM-DD')
      setData.teamType = teamObj.teamType       // 团队类型
      setData.smFlight = smObj.flight.flightNum // 送机航班
      setData.smFlightAll =
        smObj.flight.flightNum + ' ' +
        smObj.flight.flightStartCity + '-' +
        smObj.flight.flightEndCity + ' ' +
        moment(smObj.flight.flightStartTime).format('HH:mm') + '-' +
        moment(smObj.flight.flightEndTime).format('HH:mm')
      setData.smRealNumber = smObj.smRealNumber // 名单人数
      setData.smNote = smObj.smNote    // 送机备注

      setData.users = users

      if (isDownload === false) {
        Djp.update({ _id, name }, { $set: { isDownload: true } })
      }

      return setData
    },

    update: async (search, fields) => {
      await Djp.update(search, { $set: fields })
    }
  }
}
