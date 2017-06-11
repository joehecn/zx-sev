
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const ioJwt = require('socketio-jwt')
const { ygSecret } = require('../zxutil.js')
// const getSev = require('../sev.js')
const userSev = require('../service/user.js')

const ROOM_NAME = 'yg'
const tryWarp = async (data, cb, fn) => {
  try {
    await fn(data, cb)
  } catch (err) {
    cb && cb(err)
  }
}

module.exports = io => {
  const nspyg = io.of('/nspyg')

  nspyg.use(ioJwt.authorize({
    secret: ygSecret,
    handshake: true
  }))

  nspyg.on('connection', socket => {
    const uid = socket.decoded_token._id
    // console.log(socket.handshake.query.dbname)
    // socket.ygUser
    // { company: { _id, city, category, feestemp },
    //   _id,
    //   name,
    //   userName,
    //   status,
    //   role,
    //   companyAbbr }

    const joinRoom = async () => {
      try {
        const user = await userSev.initUser(uid)
        // 加入房间前清场
        const room = socket.adapter.rooms[ROOM_NAME]
        if (room) {
          const socketIdArr = Object.keys(room.sockets)
          socketIdArr.forEach(socketId => {
            const socketAnother = nspyg.connected[socketId]
            if (socketAnother.decoded_token._id === uid) {
              if (socketAnother.id === socket.id) {
                // 切换城市
                socketAnother.leave(ROOM_NAME)
              } else {
                // 通知对方下线
                socket.broadcast.to(socketId)
                  .emit('semit-cancelSomebodyOnline')
              }
            }
          })
        }

        socket.join(ROOM_NAME)
        socket.ygUser = user
      } catch (err) {
        socket.emit('semit-joinRoomFail')
      }
    }

    const checkUidInRoom = () => {
      const room = socket.adapter.rooms[ROOM_NAME]
      if (room) {
        const socketIdArr = Object.keys(room.sockets)
        const len = socketIdArr.length

        for (let i = 0; i < len; i++) {
          const socketAnother = nspyg.connected[socketIdArr[i]]
          if (socketAnother.decoded_token._id === uid) {
            return {
              somebodyInRoom: true,
              id: socketAnother.id
            }
          }
        }
      }

      return { somebodyInRoom: false }
    }

    const initSocket = () => {
      const inRoom = checkUidInRoom()
      if (inRoom.somebodyInRoom) {
        // AAA
        // * 服务器通知甲, 乙已经使用此账号进入房间了
        // * 是否要进入房间(踢乙), 由甲决定
        socket.emit('semit-somebodyIsOnlined')
      } else {
        joinRoom()
      }
    }

    // const dbname = socket.handshake.query.dbname

    initSocket()

    // BBB
    // 服务器收到来自甲的通知，甲想要进入房间(甲要踢乙)
    socket.on('cemit-somebodyWantOnline', async () => {
      var inRoom = checkUidInRoom()

      if (inRoom.somebodyInRoom) {
        // 服务器广播通知乙，甲想要进入房间
        // 是否拒绝甲进入房间, 由乙决定
        socket.broadcast.to(inRoom.id)
          .emit('sbroadcast-somebodyWantOnline', socket.id)
      } else {
        // 服务器通知甲进入房间
        socket.emit('semit-somebodyJoinRoom')
      }
    })

    // CCC
    // 乙决定是否拒绝甲们进入房间
    socket.on('cemit-cancelSomebodyOnline', obj => {
      let iscancel = obj.iscancel

      obj.ids.forEach(socketId => {
        if (nspyg.connected[socketId]) {
          // 不拒绝
          if (!iscancel) {
            // 通知乙下线
            socket.emit('semit-cancelSomebodyOnline')
            // 通知此甲进入房间
            socket.broadcast.to(socketId).emit('semit-somebodyJoinRoom')
            // 则有且仅有一个 iscancel = false
            iscancel = true
          } else {
            // 通知各位甲下线
            socket.broadcast.to(socketId).emit('semit-cancelSomebodyOnline')
          }
        }
      })
    })

    /// DDD
    // 通知服务器自己进入房间
    socket.on('cemit-somebodyJoinRoom', () => {
      // 加入房间
      joinRoom()
    })

    /// //////////////////////////////////////////////

    socket.on('event', async (data, cb) => {
      await tryWarp(data, cb, async (data, cb) => {
        const _data = await getData(data)
        cb && cb(_data)
      })
    })
  })
}
