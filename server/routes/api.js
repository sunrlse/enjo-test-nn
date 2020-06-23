const router = require('koa-router')();
const upload = require('../controller/upload');
const markdown = require('../controller/markdown');

router.prefix('/api');

// /*保存perfData接口*/
// router.post('/savePerf', perf.savePerf);
// /*获取perfData接口*/
// router.get('/getPerf', perf.getPerf);
// /*获取分类接口*/
// router.get('/getCategory', perf.getCategory);

router.get('/md', markdown.getMd)
router.post('/md', markdown.addMd)
router.post('/md/update', markdown.updateMd)
router.post('/md/del', markdown.deleteMd)

router.post('/doc/upload', upload.handleUpload)

module.exports = router