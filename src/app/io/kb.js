
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const ioJwt = require('socketio-jwt')
const { kbSecret } = require('../zxutil.js')
const getSev = require('../sev.js')

module.exports = io => {
  const nspkb = io.of('/nspkb')

  nspkb.use(ioJwt.authorize({
    secret: kbSecret,
    handshake: true
  }))

  nspkb.on('connection', socket => {
    // console.log(socket.decoded_token)
    // { _id: '5550df67979d1239595c8d5b',
    //   dbname: 'sz',
    //   iat: 1497967004 }
    const dbName = socket.decoded_token.dbname

    socket.on('event', async (data, cb) => {
      const _data = await getData(data)
      cb(_data)
    })

    socket.on('cemit-getSms', async ({ gotoday }, cb) => {
      const _data = await getSev(dbName, 'sm').getKbSms(gotoday)
      cb(_data)
    })
  })
}
