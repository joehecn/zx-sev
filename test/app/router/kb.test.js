
'use strict'

const supertest = require('supertest')
// const jwt = require('jsonwebtoken')
// const { kbSecret } = require('../../../src/app/zxutil.js')
const server = require('../../../src/app/app.js')
const { userNameNotExist, roleDisableLogin,
  categoryUnauthorized, passwordNotMatch } = require('../../../src/app/err.js')

describe('/test/app/router/kb.test.js', () => {
  describe('POST /api/kb/users/login', () => {
    // it('should 200', async () => {
    //   // base64 编码
    //   const userObj = { userName: 'hemiao', password: '12341234' }
    //   const userStr = JSON.stringify(userObj)
    //   const user = Buffer.from(userStr).toString('base64')

    //   const res = await supertest(server.listen())
    //     .post('/api/kb/users/login')
    //     .send({ user })
    //     .expect(200)

    //   // console.log(res.text)

    //   const { dbname } = jwt.verify(res.text, kbSecret)
    //   expect(dbname).toBe('sz')
    //   // expect(name).toBe('禾苗')
    // })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'hemiao11', password: '12341234' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/kb/users/login')
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
        .post('/api/kb/users/login')
        .send({ user })
        .expect(401)
        .expect(roleDisableLogin)
    })

    // it('should 401', async () => {
    //   // base64 编码
    //   const userObj = { userName: '806694058', password: '12341234' }
    //   const userStr = JSON.stringify(userObj)
    //   const user = Buffer.from(userStr).toString('base64')

    //   return supertest(server.listen())
    //     .post('/api/kb/users/login')
    //     .send({ user })
    //     .expect(401)
    //     .expect(statusInReviewLogin)
    // })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'xiaobangshou', password: '123456' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/kb/users/login')
        .send({ user })
        .expect(401)
        .expect(categoryUnauthorized)
    })

    it('should 401', async () => {
      // base64 编码
      const userObj = { userName: 'hemiao', password: '123412345' }
      const userStr = JSON.stringify(userObj)
      const user = Buffer.from(userStr).toString('base64')

      return supertest(server.listen())
        .post('/api/kb/users/login')
        .send({ user })
        .expect(401)
        .expect(passwordNotMatch)
    })
  })
})
