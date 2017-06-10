
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const ioJwt = require('socketio-jwt')
const { kbSecret } = require('../zxutil.js')

module.exports = io => {
  const nspkb = io.of('/nspkb')

  nspkb.use(ioJwt.authorize({
    secret: kbSecret,
    handshake: true
  }))

  nspkb.on('connection', socket => {
    // console.log(socket.decoded_token)

    socket.on('event', async (data, cb) => {
      const _data = await getData(data)
      cb(_data)
    })
  })
}
