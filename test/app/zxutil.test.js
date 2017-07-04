
'use strict'

const { PROVINCE_CITY, CITY_DB, CITY_PLACES, DB_CITY } = require('../../src/app/zxutil.js')

describe('/test/app/zxutil.test.js', () => {
  it('PROVINCE_CITY', () => {
    console.log(PROVINCE_CITY)
    expect(PROVINCE_CITY['广东']['深圳']).toBe('sz')
  })

  it('CITY_DB', () => {
    console.log(CITY_DB)
    expect(CITY_DB['深圳']).toBe('sz')
  })

  it('CITY_PLACES', () => {
    console.log(CITY_PLACES)
    expect(CITY_PLACES['深圳'][0]).toBe('6')
  })

  it('DB_CITY', () => {
    console.log(DB_CITY)
    expect(DB_CITY['sz']).toBe('深圳')
  })
})
