'use strict'

const supertest = require('supertest')
const { server } = require('../../src/app/app.js')
const ioc = require('socket.io-client')

afterEach(() => {
  server.close()
})

describe('/test/app/app.test.js', () => {
  describe('GET /', () => {
    it('should 200', () => {
      return supertest(server.listen())
        .get('/')
        .expect(200)
        .expect('hello')
    })
  })
})

describe('socket', () => {
  it('should ok', done => {
    server.listen(3000, () => {
      const client = ioc('ws://localhost:3000', { reconnection: false })
      client.on('connect', () => {
        client.emit('event', 'data', result => {
          expect(result).toBe('data')
          done()
        })
      })
    })
  })
})
