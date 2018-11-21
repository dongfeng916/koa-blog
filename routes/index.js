const router = require('koa-router')()

router.get('/', require('./home').index)

router.get('/signup', require('./user').signup)
router.post('/signup', require('./user').signup)
router.get('/signin', require('./user').signin)
router.post('/signin', require('./user').signin)
router.get('/signout', require('./user').signout)

module.exports = router
