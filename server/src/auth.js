const log = require('../../src/log.js')
const userStore = require('./userStore')

// koa passport
const passport = require('koa-passport')
passport.serializeUser(function (user, done) {
  log.info('serialize user:', user.id)
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  log.info('deserialize user:', id)
  let user = await userStore.getUserById(id)
  if (user) {
    done(null, { id: user.id, username: user.name })
  } else {
    done(null, false)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(async function (username, password, done) {
  let user = await userStore.getUserByName(username)
  if (user && check(password, user.hash)) {
    done(null, user)
  } else {
    log.info(`auth failed for`, username)
    done(null, false)
  }
}))

// auth router
const Router = require('koa-router')
const pub = new Router()
pub.post('/s/logout', function (ctx) {
  ctx.logout()
  ctx.redirect('s/status')
}).post('/s/login',
  passport.authenticate('local', {
    successRedirect: '/s/status',
    failureRedirect: '/s/status'
  })
).post('/s/register', async (ctx) => {
  log.info('register:', JSON.stringify(ctx.request.body))
  let u = ctx.request.body
  u.id = Date.now()
  u.hash = encrypt(u.password)
  let success = userStore.addUser(u)
  if (success) {
    ctx.login(u)
    ctx.redirect('/s/status')
  } else {
    ctx.throw(409)
  }
}).get('/s/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    let user = ctx.state.user
    ctx.body = {username: user.username, uid: user.id}
  } else {
    ctx.throw(401)
  }
})

async function guard (ctx, next) {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.body = {success: false}
    ctx.throw(401)
  }
}

// password encrypt
const bcrypt = require('bcrypt');
function encrypt(input) {
  return bcrypt.hashSync(input, 5); // salt 5 round
}

function check(input, hash) {
  return bcrypt.compareSync(input, hash);
}

module.exports = {
  pub: pub,
  guard: guard,
  passport: passport
}
