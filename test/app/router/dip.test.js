
'use strict'

const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const server = require('../../../src/app/app.js')
const { dbNameNotEmpty, nameNotEmpty, nameNotExist,
  passwordNotEmpty, passwordNotMatch, smDataNotEmpty,
  smDataNotValid } = require('../../../src/app/err.js')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYk5hbWUiOiJzeiIsIm5hbWUiOiLmt7HlnLPmub4iLCJpYXQiOjE0OTYwNjUxNDl9.aw4Ou5NkvdXT_1ElyuMWY9NqjPv-UIGDIvMPkDIU6MU'

afterEach(() => {
  server.close()
})

describe('/test/app/router/djp.test.js', () => {
  describe('POST /api/djp/users/login', () => {
    it('should 204 success', async () => {
      // base64 编码
      const userObj = { dbName: 'sz', name: '深圳湾', password: 'shenzhenwan' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      const res = await supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(204)

      const { dbName, name } = jwt.verify(res.header.authorization.split(' ')[1], 'secret')
      expect(dbName).toBe('sz')
      expect(name).toBe('深圳湾')
    })

    // 数据库不能为空
    it('should 401 dbNameNotEmpty', () => {
      // base64 编码
      const userObj = {}
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(dbNameNotEmpty)
    })

    // 数据库不存在时名称不存在
    it('should 401 nameNotExist', () => {
      // base64 编码
      const userObj = { dbName: 'sz1', name: '深圳湾', password: 'shenzhenwan' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(nameNotExist)
    })

    // 名称不能为空
    it('should 401 nameNotEmpty', () => {
      // base64 编码
      const userObj = { dbName: 'sz' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(nameNotEmpty)
    })

    // 名称不存在
    it('should 401 nameNotExist', () => {
      // base64 编码
      const userObj = { dbName: 'sz', name: '深圳湾1', password: 'shenzhenwan' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(nameNotExist)
    })

    // 密码不能为空
    it('should 401 passwordNotEmpty', () => {
      // base64 编码
      const userObj = { dbName: 'sz', name: '深圳湾' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(passwordNotEmpty)
    })

    // 密码不匹配
    it('should 401 passwordNotMatch', () => {
      // base64 编码
      const userObj = { dbName: 'sz', name: '深圳湾', password: 'shenzhenwan1' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(passwordNotMatch)
    })
  })

  describe('GET /api/djp/djps', () => {
    it('should 401', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .expect(401)
        .expect('Authentication Error')
    })

    it('should 400 smDataNotEmpty', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(smDataNotEmpty)
    })

    // 2000年彩蛋
    it('should 400 smDataNotValid', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2000-05-00' })
        .expect(400)
        .expect(smDataNotValid)
    })
    // 2000年彩蛋
    it('should 400 smDataNotValid', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2000-05-13' })
        .expect(400)
        .expect(smDataNotValid)
    })
    it('should 400 smDataNotValid', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2017-05-32' })
        .expect(400)
        .expect(smDataNotValid)
    })

    // 2000年彩蛋
    it('should 200', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2000-07-01' })
        .expect(200) // 264
    })
    it.only('should 200', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2017-05-01' })
        .expect(200) // 5
    })
  })
})
