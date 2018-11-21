const Koa = require('koa')

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('./routes/index')
const session = require('koa-session')
const mongoose = require('mongoose')
const CONFIG = require('./config/config')
const flash = require('./middlewares/flash')


const app = new Koa()
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  map: {html: 'nunjucks'}
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//databases
mongoose.connect(CONFIG.mongodb, {useNewUrlParser:true, useCreateIndex: true})

//session
app.keys = ['somethings']  //设置cook的键
app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
},app))
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.use(flash())
// routes
//koa-view的数据来源于ctx.state
//const state = Object.assign(locals, options, ctx.state || {})
app.use(async (ctx,next)=>{
  ctx.state.ctx = ctx
  await next()
})
app.use(router.routes(), router.allowedMethods())

module.exports = app
