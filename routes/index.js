const router = require('koa-router')()

router.get('/', require('./home').index)

// router.get('/about', require('./about').index)

module.exports = router
