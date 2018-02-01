// This is sample code to showcase a naive strategy

const Koa = require('koa')
const app = new Koa()

// use passport with naive strategy
const passport = require('koa-passport')
const naiveStrategy = require('./naive')
passport.use(naiveStrategy)
app.use(passport.authenticate('naive', {session: false}))

const Router = require('koa-router')
const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = 'hello ' + JSON.stringify(ctx.state.user)
})
app.use(router.routes())

// server
const http = require('http')
http.createServer(app.callback()).listen(3000)
