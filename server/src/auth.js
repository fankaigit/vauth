const log = require('./log.js')
const userStore = require('./userStore')

// koa passport
const passport = require('koa-passport')
const NO_ERROR = null
passport.serializeUser(function (user, done) {
  done(NO_ERROR, user.id)
})

passport.deserializeUser(async function (id, done) {
  let user = await userStore.getUserById(id)
  if (user) {
    done(NO_ERROR, { id: user.id, username: user.name })
  } else {
    done(NO_ERROR, false)
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
const unsafe = new Router()
unsafe.post('/s/login',
  passport.authenticate('local', { successRedirect: '/s/status' })
).post('/s/logout', async (ctx) => {
  await ctx.logout()
  ctx.status = 401
}).post('/s/register', async (ctx) => {
  let u = ctx.request.body
  u.id = Date.now()
  u.hash = encrypt(u.password)
  let success = await userStore.addUser(u)
  if (success) {
    log.info(`new user registered, uid=${u.id}, username=${u.username}`)
    ctx.login(u)
    ctx.redirect('/s/status')
  } else {
    ctx.throw(409)
  }
})

async function verify (ctx, next) {
  if (ctx.isAuthenticated()) {
    await next()
  } else {
    ctx.throw(401)
  }
}

const safe = new Router()
safe.get('/s/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    let user = ctx.state.user
    ctx.body = {username: user.username, uid: user.id}
  } else {
    ctx.throw(401)
  }
})

// password encrypt
const bcrypt = require('bcrypt');
function encrypt (input) {
  return bcrypt.hashSync(input, 5); // salt 5 round
}

function check (input, hash) {
  return bcrypt.compareSync(input, hash);
}

function guard (app) {
  const session = require('koa-session')
  app.keys = ['yet-to-set-a-better-secret']
  app.use(session(app))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(unsafe.routes())
  app.use(verify)
  app.use(safe.routes())
}

module.exports = {
  guard
}
