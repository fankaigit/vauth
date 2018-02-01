const Koa = require('koa')
const app = new Koa()

// enable session
const session = require('koa-session')
app.keys = ['some secret']
const conf = {
  encode: json => JSON.stringify(json),
  decode: str => JSON.parse(str)
}
app.use(session(conf, app))


// define serializer/deserializer
const passport = require('koa-passport')
const NO_ERROR = null
passport.serializeUser(function (user, done) {
  done(NO_ERROR, user.id)
})
passport.deserializeUser(async function (id, done) {
  done(NO_ERROR, {id})
})

// use passport and session strategy
const naiveStrategy = require('./naive')
passport.use(naiveStrategy)
app.use(passport.initialize())
app.use(passport.session())


const Router = require('koa-router')
const router = new Router()
// naive strategy is used for login
router.get('/login',
  passport.authenticate('naive', { successRedirect: '/' })
).get('/logout', (ctx) => {
  ctx.logout()
  ctx.redirect('/')
}).get('/', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = 'hello ' + JSON.stringify(ctx.state.user)
  } else {
    ctx.throw(401)
  }
})
app.use(router.routes())

// server
const http = require('http')
http.createServer(app.callback()).listen(3000)
