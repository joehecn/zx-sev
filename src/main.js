
'use strict'

const server = require('./app/app.js')
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`server listen on ${port}`)
})
