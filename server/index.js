
const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
// const Monk = require('monk')
const db = require('../connections/db')
const cors = require('koa-cors');
const convert = require('koa-convert')

const api = require('./routes/api');
const app = new Koa()

app.context.db = db

// 进行requestbody解析
app.use(bodyParser())
// 加入路由
app.use(router.routes())
// 处理跨域
app.use(convert(cors()))

// 路由处理，在api中
app.use(api.routes(), api.allowedMethods())


// const host = process.env.HOST || '**.**.**.134'
const port = process.env.PORT || 3006
// console.log('--------------------')
// console.log(process.env)
// console.log('--------------------')
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    ctx.respond = false
    ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
    // return new Promise((resolve, reject) => {
    //   ctx.res.on('close', resolve)
    //   ctx.res.on('finish', resolve)
    //   nuxt.render(ctx.req, ctx.res, promise => {
    //     // nuxt.render passes a rejected promise into callback on error.
    //     if (promise) {
    //       promise.then(resolve).catch(reject)
    //     } else {
    //       next()
    //     }
    //   })
    // })
  })

  app.listen(port)
  consola.ready({
    message: `Server listening on http://localhost:${port}`,
    badge: true
  })
}

start()
