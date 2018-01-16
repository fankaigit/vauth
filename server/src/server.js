const log = require('../../src/log.js')
const Koa = require('koa')
const app = new Koa()

// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  log.info(`${ctx.method} ${ctx.url} - cost ${ms} ms`)
})

// cors
const cors = require('koa2-cors')
app.use(cors({
  origin: () => '*'
}))

// body parser
const koaBody = require('koa-body')
app.use(koaBody({
  jsonLimit: '1mb'
}))

// auth
const session = require('koa-session')
app.keys = ['yet-to-set-a-better-secret']
app.use(session({}, app))

const auth = require('./auth')
app.use(auth.passport.initialize())
app.use(auth.passport.session())
app.use(auth.pub.routes())
app.use(auth.guard)

// response
const fs = require('fs')
const Router = require('koa-router')
const router = new Router()
router.get('/s/:id', async (ctx) => {
  log.info(`get ${ctx.params.id}`)
}).post('/s/vlog/data/:id', async (ctx) => {
  let content = JSON.stringify(ctx.request.body)
  log.info(`post ${ctx.params.id} : ${content}`)
})
app.use(router.routes())

// server
const http = require('http')
http.createServer(app.callback()).listen(3000)
log.info('vlog server started')