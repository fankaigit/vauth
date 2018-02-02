const log = require('./log.js')
const db = require('./store')

const createUserTableSql = 'CREATE TABLE IF NOT EXISTS user (' +
  'id INTEGER PRIMARY KEY,' +
  'name TEXT NOT NULL, ' +
  'hash TEXT NOT NULL,' +
  'CONSTRAINT unique_name UNIQUE (name)' +
  ')'

async function initUserTable() {
  db.run(createUserTableSql)
  let row = await db.get('SELECT COUNT(*) AS cnt FROM user')
  log.info('current user count:', row.cnt)
}
db.init(initUserTable)

// interface
async function getUserById (id) {
  try {
    let row = await db.get('SELECT * FROM user WHERE id=?', [id])
    return row
  } catch (err) {
    log.error(err)
  }
}

async function getUserByName (name) {
  try {
    let row = await db.get('SELECT * FROM user WHERE name=?', [name])
    return row
  } catch (err) {
    log.error(err)
  }
}

async function addUser (user) {
  try {
    await db.run('INSERT INTO user (id, name, hash) VALUES (?, ?, ?)', [user.id, user.username, user.hash])
    return true
  } catch (err) {
    log.error(err)
    return false
  }
}

module.exports = {
  getUserById,
  getUserByName,
  addUser
}
