
'use strict'

const server = require('../../../src/app/app.js')
const ioc = require('socket.io-client')

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTUwZGY2Nzk3OWQxMjM5NTk1YzhkNWIiLCJkYk5hbWUiOiJzeiIsIm5hbWUiOiLnpr7oi5ciLCJpYXQiOjE0OTY5MjEyNzJ9.wXrOm5yBldk6v4xU0HLSco4RfbTEP_lCR5jIZkMXjYs'

afterEach(() => {
  server.close()
})

describe.skip('/test/app/io/kb.test.js', () => {
  describe('event', () => {
    it('should ok', done => {
      server.listen(3002, () => {
        const client = ioc('ws://localhost:3002/nspkb', {
          query: `token=${token}`,
          reconnection: false
        })
        client.on('connect', () => {
          client.emit('event', 'data', result => {
            expect(result).toBe('data')
            done()
          })
        })
      })
    })
  })
})
