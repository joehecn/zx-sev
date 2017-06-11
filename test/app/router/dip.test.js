
'use strict'

const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const { djpSecret } = require('../../../src/app/zxutil.js')
const server = require('../../../src/app/app.js')
const { nameNotExist, passwordNotMatch, smDataNotValid } = require('../../../src/app/err.js')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYk5hbWUiOiJzeiIsIm5hbWUiOiLmt7HlnLPmub4iLCJpYXQiOjE0OTY3NDQwNDl9.VCtD6j_lQJidH8wunksecHsXAlT_9q0G0YiAiFWy_FU'

afterEach(() => {
  server.close()
})

describe.skip('/test/app/router/djp.test.js', () => {
  // describe('GET /api/djp/err', () => {
  //   it('should 200', async () => {
  //     return supertest(server.listen())
  //       .get('/api/djp/err')
  //       .expect(200)
  //   })
  // })

  describe('GET /api/djp/citydb', () => {
    it('should 200', async () => {
      const res = await supertest(server.listen())
        .get('/api/djp/citydb')
        .expect(200)
      expect(res.body['深圳']).toBe('sz')
    })
  })

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

      const { dbName, name } = jwt.verify(res.text, djpSecret)
      expect(dbName).toBe('sz')
      expect(name).toBe('深圳湾')
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
    it('should 200', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2017-05-01' })
        .expect(200) // 5
    })

    // 2000年彩蛋
    it('should 200', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .set('Authorization', `Bearer ${token}`)
        .query({ smDate: '2000-07-01' })
        .expect(200) // 264
    })

    it('should 401', () => {
      return supertest(server.listen())
        .get('/api/djp/djps')
        .expect(401)
        .expect('Authentication Error')
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
  })

  describe('PUT /api/djp/djps/isdownload/:id', () => {
    it('should 200', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: false })
        .expect(200)
    })

    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isdownload/5905426ceb14970e00771be6')
        .expect(401)
        .expect('Authentication Error')
    })
  })

  describe('PUT /api/djp/djps/isprint/:id', () => {
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

    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/isprint/5905426ceb14970e00771be')
        .expect(401)
        .expect('Authentication Error')
    })
  })

  describe('PUT /api/djp/djps/djpnote/:id', () => {
    it('should 204', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be6')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 'notes' })
        .expect(204)
    })

    it('should 401', () => {
      return supertest(server.listen())
        .put('/api/djp/djps/djpnote/5905426ceb14970e00771be')
        .expect(401)
        .expect('Authentication Error')
    })
  })
})
