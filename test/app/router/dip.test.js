
'use strict'

const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const server = require('../../../src/app/app.js')
const { dbNameNotEmpty, nameNotEmpty, nameNotExist,
  passwordNotEmpty, passwordNotMatch, smDataNotEmpty,
  smDataNotValid, ObjectIdNotValid, isDownloadNotValid,
  djpObjNotExist, djpNoteNotValid, isPrintNotValid } = require('../../../src/app/err.js')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYk5hbWUiOiJzeiIsIm5hbWUiOiLmt7HlnLPmub4iLCJpYXQiOjE0OTYwNjUxNDl9.aw4Ou5NkvdXT_1ElyuMWY9NqjPv-UIGDIvMPkDIU6MU'

afterEach(() => {
  server.close()
})

describe('/test/app/router/djp.test.js', () => {
  describe('POST /api/djp/users/login', () => {
    it('should 200', async () => {
      // base64 编码
      const userObj = { dbName: 'sz', name: '深圳湾', password: 'shenzhenwan' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      const res = await supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(200)

      const { dbName, name } = jwt.verify(res.text, 'secret')
      expect(dbName).toBe('sz')
      expect(name).toBe('深圳湾')
    })

    // 数据库不能为空
    it('should 401 dbNameNotEmpty', () => {
      const user = {}

      return supertest(server.listen())
        .post('/api/djp/users/login')
        .send({ user })
        .expect(401)
        .expect(dbNameNotEmpty)
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
    it('should 200', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2017-05-01' })
        .expect(200) // 5
    })
  })

  describe('PUT /api/djp/djps/isdownload/:id', () => {
    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be6')
        .expect(401)
        .expect('Authentication Error')
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: false })
        .expect(400)
        .expect(ObjectIdNotValid)
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'notes' })
        .expect(400)
        .expect(isDownloadNotValid)
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00871be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: false })
        .expect(400)
        .expect(djpObjNotExist)
    })

    it('should 200', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: false })
        .expect(200)
    })
  })

  describe('PUT /api/djp/djps/isprint/:id', () => {
    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e00771be')
        .expect(401)
        .expect('Authentication Error')
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e00771be')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(ObjectIdNotValid)
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(isPrintNotValid)
    })

    it('should 204', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e80771be0')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: false })
        .expect(204)
    })

    it('should 204', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: true })
        .expect(204)
    })
  })

  describe('PUT /api/djp/djps/djpnote/:id', () => {
    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be')
        .expect(401)
        .expect('Authentication Error')
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'notes' })
        .expect(400)
        .expect(ObjectIdNotValid)
    })

    it('should 400', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(djpNoteNotValid)
    })

    it('should 204', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'notes' })
        .expect(204)
    })
  })
})
