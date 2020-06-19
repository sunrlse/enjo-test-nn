const fs = require('fs')

function checkFileType(str) {
  if (str.indexOf('image/') > -1) {
    return 'image'
  }
  if (str.indexOf('video/') > -1) {
    return 'video'
  }
  if (str.indexOf('audio/') > -1) {
    return 'audio'
  }
  return 'other'
}

const handleUpload = async (ctx) => {
  console.log('======================================================')
  console.log(ctx.request.files)
  const received_files = ctx.request.files['file[]']
  const files = Array.isArray(received_files) ? received_files : [received_files];
  const succMap = {}
  const succFiles = []
  for (let i = 0; i < files.length; i++) {

    let file = files[i]
    const filename = file.name
    const fileType = checkFileType(file.type);
    console.log(fileType)
    console.log('======================================================')
  
    const savePath = path.join(__dirname, `../../markdown/assets/${fileType}/${filename}`)
    const accessPath = `/${fileType}/${filename}`
    const reader = fs.createReadStream(file.path)
    const stream = fs.createWriteStream(savePath)
    reader.pipe(stream)
    console.log('-------------uploading----------')
    console.log('文件名： ', filename, '  ', stream.path)
    console.log('-------------uploading----------')
    // ctx.body = 'ok'
    succMap[filename] = accessPath
    succFiles.push({
      name: filename,
      src: accessPath,
      type: fileType
    })
  }



  ctx.body = {
    msg: 'ok',
    code: 0,
    data: {
      errFiles: [],
      succFiles,
      succMap
    }
  }
}


module.exports = {
  handleUpload
}