const log = require('./log.js')
const Koa = require('koa')
const app = new Koa()

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
const auth = require('./auth')
auth.guard(app)

// response
const Router = require('koa-router')
const router = new Router()
router.post('/s/', async (ctx) => {
  ctx.body = 'hello'
})
app.use(router.routes())

// server
const http = require('http')
http.createServer(app.callback()).listen(3000)
log.info('vauth server started')
