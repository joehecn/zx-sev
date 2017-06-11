
'use strict'

const server = require('../../../src/app/app.js')
const ioc = require('socket.io-client')

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTUwZGY2Nzk3OWQxMjM5NTk1YzhkNWIiLCJkYm5hbWUiOiJzeiIsImlhdCI6MTQ5NjkyNDMwNn0.iyy_6OOu-lTp2K2iWKzXUCZzDaHquTqJuJjVQmmui9c'

afterEach(() => {
  server.close()
})

describe('/test/app/io/yg.test.js', () => {
  describe('event', () => {
    it('should ok', done => {
      server.listen(3001, () => {
        const client = ioc.connect('ws://localhost:3001/nspyg', {
          query: `dbname=sz&token=${token}`,
          reconnection: false
        })

        // console.log(client)
        // console.log(client.decoded_token)
        // console.log(client.handshake)

        client.on('connect', () => {
          setTimeout(client.emit('event', 'data', result => {
            // console.log(result)
            expect(result).toBe('data')
            done()
          }))
        })
      })
    })
  })
})
