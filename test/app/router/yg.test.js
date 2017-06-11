
'use strict'

const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const { ygSecret } = require('../../../src/app/zxutil.js')
const server = require('../../../src/app/app.js')
const { userNameNotExist, roleDisableLogin, statusInReviewLogin,
  passwordNotMatch } = require('../../../src/app/err.js')

describe.skip('/test/app/router/yg.test.js', () => {
  describe('POST /api/yg/users/login', () => {
    it('should 200', async () => {
      // base64 编码
      const userObj = { userName: 'hemiao', password: '12341234' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      const res = await supertest(server.listen())
        .post('/api/yg/users/login')
        .send({ user })
        .expect(200)

      // console.log(res.text)

      const { _id, dbname } = jwt.verify(res.text, ygSecret)
      expect(_id).toBe('5550df67979d1239595c8d5b')
      expect(dbname).toBe('sz')
    })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'hemiao11', password: '12341234' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/yg/users/login')
        .send({ user })
        .expect(401)
        .expect(userNameNotExist)
    })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'xiaomin', password: '12341234' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/yg/users/login')
        .send({ user })
        .expect(401)
        .expect(roleDisableLogin)
    })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: '806694058', password: '12341234' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/yg/users/login')
        .send({ user })
        .expect(401)
        .expect(statusInReviewLogin)
    })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'hemiao', password: '123412345' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/yg/users/login')
        .send({ user })
        .expect(401)
        .expect(passwordNotMatch)
    })
  })
})
