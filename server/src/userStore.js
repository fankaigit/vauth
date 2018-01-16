const log = require('../../src/log.js')
const store = require('./store')
const db = store.db
const dbget = store.dbget
const dbrun = store.dbrun

const createUserTableSql = 'CREATE TABLE IF NOT EXISTS user (' +
  'id INTEGER PRIMARY KEY,' +
  'name TEXT NOT NULL, ' +
  'hash TEXT NOT NULL,' +
  'CONSTRAINT unique_name UNIQUE (name)' +
  ')'

async function initUserTable() {
  db.run(createUserTableSql)
  let row = await dbget('SELECT COUNT(*) AS cnt FROM user')
  log.info('current user count:', row.cnt)
}
db.serialize(initUserTable)

// interface
async function getUserById (id) {
  try {
    let row = await dbget('SELECT * FROM user WHERE id=?', [id])
    log.info(JSON.stringify(row))
    return row
  } catch (err) {
    log.error(err)
  }
}

async function getUserByName (name) {
  try {
    let row = await dbget('SELECT * FROM user WHERE name=?', [name])
    log.info(JSON.stringify(row))
    return row
  } catch (err) {
    log.error(err)
  }
}

async function addUser (user) {
  try {
    log.info(JSON.stringify(user))
    await dbrun('INSERT INTO user (id, name, hash) VALUES (?, ?, ?)', [user.id, user.username, user.hash])
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}

module.exports = {
  getUserById: getUserById,
  getUserByName: getUserByName,
  addUser: addUser
}
