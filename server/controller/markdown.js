const Koa = require('koa')
const fs = require('fs')
const uuid = require('uuid')
const path = require('path')
const router = require('koa-router')()
// const Monk = require('monk')
const marked = require('marked');
const tb = 'list'

const handleMd = (uri) => {
  return new Promise((resolve, reject) => {
    let str = ''
    fs.readFile(uri, 'utf8',function(err, data) {
      console.log(err)
      console.log('-----------------------------------------------------------------')
        if (err) {
            console.log("文件不存在！");
            str = "文档走丢了~";
        } else {
            console.log(data);
            str = data.toString()
        }
        resolve(str)
    });
  })
}

const getMd = async ctx => {
  let qs_aid = ctx.query.aid
  console.log('-----------------------------------------------------------------')
  console.log(ctx.request)
  console.log(qs_aid)
  try {
    // console.log('begin read')
    // let url = path.resolve(__dirname, '../../markdown/mds/'+ filename +'.md')
    // console.log(url)
    // let str = await handleMd(url)
    let sql = `select * from ${tb} WHERE aid = '${qs_aid}'`
    let results = await ctx.db.execSQL(sql)
    console.log(results)
    let res = {}
    if (results && Array.isArray(results)) {
      res = results[0]
    }
    console.log('=========== end ===================')
    ctx.body = {
      data: res
    }
  } catch (error) {
    ctx.body = {
      data: ''
    }
  }
}

const addMd = async ctx => {
  try {
    let params = ctx.request.body
    let fields = ''
    let values = ''
    let uid = uuid.v1()
    params.aid = uid
    for (let k in params) {
      fields += k + ','
      values += "'" + params[k] + "',"
    }
    fields = fields.slice(0, -1)
    values = values.slice(0, -1)
    let sql = `INSERT INTO ${tb}(${fields}) VALUES(${values})`
    let result = await ctx.db.execSQL(sql)
    ctx.body = {
      data: 'ok'
    }
  } catch (error) {
    ctx.body = {
      data: 'sth. wrong'
    }
  }
}

const updateMd = async ctx => {
  try {
    let { aid, content } = ctx.request.body
    let toset = {
      content: content
    }
    let where = {
      aid: aid
    }
    let _sets = ''
    let _where = ''
    for (let k in toset) {
      _sets += k + "='" + toset[k] + "',"
    }
    _sets = _sets.slice(0, -1)
    for (let k2 in where) {
      _where += k2 + "='" + where[k2] + "' AND "
    }
    _where = _where.slice(0, -5)
    const sql = `UPDATE ${tb} SET ${_sets} WHERE ${_where}`
    const result = await ctx.db.execSQL(sql)
    console.log(result)
    ctx.body = {
      data: 'succ'
    }
  } catch (error) {
    ctx.body = {
      data: 'sth. wrong'
    }
  }
}

const deleteMd = async ctx => {
  try {
    console.log('-------------------------------------------------')
    debugger
    let { aid } = ctx.request.body
    let where = {
      aid: aid
    }
    let _where = ''
    for (let k2 in where) {
      _where += k2 + "='" + where[k2] + "' AND "
    }
    _where = _where.slice(0, -5)
    const sql = `DELETE FROM ${tb} WHERE ${_where}`
    console.log(sql)
    const result = await ctx.db.execSQL(sql)
    console.log(result)
    console.log('-------------------------------------------------')
    ctx.body = {
      data: 'done'
    }
  } catch (error) {
    ctx.body = {
      data: 'sth. wrong'
    }
  }
}

// // 存性能数据
// const savePerf = async (ctx) => {
//   try {
//       const db= Monk('localhost/test');//链接到库
//       const perf = db.get('perf');//表
//       const perfData =  Object.assign(ctx.request.query,{saveTime: new Date()}) 
//       perf.insert({"perfTest": perfData})
//       console.log('post perf.....',perfData)
//       ctx.status = 200
//       ctx.body = JSON.stringify({status:0})
//   } catch (error) {
//       ctx.body = {
//         error:1,
//         info:error
//       }
//   }
// }

// // 取性能数据
// const getPerf = async (ctx) => {
//   try {
//       const db= Monk('localhost/test');//链接到库
//       const perf = db.get('test');//表
//       ctx.status = 200
//       let path = ctx.params.id
//       console.log('get ctx.req', ctx.request.query)
//       let st = await perf.find({"perfTest.path": ctx.request.query.path}, {_id:false});
//       const data = [...st]
//       ctx.body = JSON.stringify({status: 0, data})
//   } catch (error) {
//       ctx.body = {
//         error:1,
//         info:error
//       }
//   }
// }

// // 取页面分类
// const getCategory = async (ctx) => {
//   try {
//       const db= Monk('localhost/test');//链接到库
//       const perf = db.get('ltt');//表
//       ctx.status = 200
//       let all = await perf.find({},{_id:false});
//       let cate = []
//       all.forEach((item, index) => {
//         if(!cate.includes(item.perfTest.path) && item.perfTest.path) {
//           cate.push(item.perfTest.path)
//         }
//       });
//       const data = [...cate]
//       ctx.body = JSON.stringify({status: 0, data})
//   } catch (error) {
//       ctx.body = {
//         error:1,
//         info:error
//       }
//   }
// }


module.exports = {
  getMd,
  addMd,
  updateMd,
  deleteMd,
  // savePerf,
  // getPerf,
  // getCategory
}