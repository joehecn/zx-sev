
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const ioJwt = require('socketio-jwt')
const { ygSecret } = require('../zxutil.js')
// const getSev = require('../sev.js')
const userSev = require('../service/user.js')

// const initUser = async (nspyg, socket, uid, dbname) => {
//   const res = await userSev.initUser(uid, dbname)
// }

const tryWarp = async (data, cb, fn) => {
  try {
    await fn(data, cb)
  } catch (err) {
    cb && cb(err)
  }
}

module.exports = io => {
  const nspyg = io.of('/nspyg')

  nspyg.use(ioJwt.authorize({
    secret: ygSecret,
    handshake: true
  }))

  nspyg.on('connection', async socket => {
    // console.log(socket.decoded_token)
    // console.log(socket.handshake.query)
    // 记录当前用户
    // { company: { _id, city, category, feestemp },
    //   _id,
    //   name,
    //   userName,
    //   status,
    //   role,
    //   companyAbbr }
    // let userObj = {}

    const uid = socket.decoded_token._id
    // const dbname = socket.handshake.query.dbname

    const res = await userSev.initUser(uid)
    console.log(res)

    socket.on('event', async (data, cb) => {
      await tryWarp(data, cb, async (data, cb) => {
        const _data = await getData(data)
        cb && cb(_data)
      })
    })
  })
}
