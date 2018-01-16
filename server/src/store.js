const log = require('../../src/log.js')

const sqlite3 = require('sqlite3').verbose()
const dbFile = 'data/db'

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    log.error(`Error open ${dbFile}: `, err)
    process.exit()
  }
  log.info(`Connected to ${dbFile}`)
})

process.on('SIGINT', function () {
  log.error('Caught interrupt signal, will save data and exit!')
  db.close((err) => {
    if (err) {
      log.error(`Error close ${dbFile}: `, err)
    }
    process.exit()
  })
})

function dball (sql, data) {
  return new Promise(function (resolve, reject) {
    db.all(sql, data, (err, rows) => {
      err ? reject(err) : resolve(rows)
    });
  })
}

function dbget (sql, data) {
  return new Promise(function (resolve, reject) {
    db.get(sql, data, (err, row) => {
      err ? reject(err) : resolve(row)
    });
  })
}

function dbrun (sql, data) {
  return new Promise(function (resolve, reject) {
    db.run(sql, data, (err) => {
      err ? reject(err) : resolve()
    });
  })
}

module.exports = {
  db: db,
  dbget: dbget,
  dbrun: dbrun
}
