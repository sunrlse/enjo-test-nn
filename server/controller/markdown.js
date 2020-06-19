const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
// const Monk = require('monk')
const marked = require('marked');

const handleMd = (uri) => {
  return new Promise((resolve, reject) => {
    let str = ''
    fs.readFile(uri, 'utf8',function(err, data) {
      console.log(err)
      console.log('-----------------------------------------------------------------')
        if(err){
            console.log("文件不存在！");
            str = "文件不存在！";
        }else{
            console.log(data);
            // str = marked(data.toString());
            str = data.toString()
        }
        resolve(str)
    });
  })
}

const getMd = async ctx => {
  let filename = ctx.query.name
  console.log('-----------------------------------------------------------------')
  console.log(filename)
  try {
    console.log('begin read')
    let uri = path.resolve(__dirname, '../../markdown/mds/'+ filename +'.md')
    console.log(uri)
    let str = await handleMd(uri)
    console.log('=========== end ===================')
    ctx.body = {
      data: str
    }
  } catch (error) {
    ctx.body = {
      error: 'error',
      data: ''
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
  // savePerf,
  // getPerf,
  // getCategory
}