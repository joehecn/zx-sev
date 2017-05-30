
'use strict'

const supertest = require('supertest')
const server = require('../../../src/app/app.js')

describe.skip('/test/app/router/index.test.js', () => {
  describe('GET /', () => {
    it('should 200', () => {
      return supertest(server.listen())
        .get('/')
        .expect(200)
        .expect('server look\'s good')
    })
  })
})
