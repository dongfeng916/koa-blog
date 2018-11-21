const bcrypt = require('bcryptjs')  //密码加密加盐
const UserModel = require('../models/user')

module.exports = {
    async signup (ctx, next) {
        if (ctx.method === 'GET'){
            await ctx.render('signup',{
                title: '用户注册'
            })
            return
        }
        //生成salt
        const salt = await bcrypt.genSalt(10)
        let {name, email, password} = ctx.request.body
        //TODO合法性校验
        //对密码进行加密
        password = await bcrypt.hash(password, salt)
        const user = {
            name,
            email,
            password
        }
        //存储到数据库
        const result = await UserModel.create(user)
        ctx.body = result
    },
    async signin (ctx, next) {
        if(ctx.method ==='GET') {
            await ctx.render('signin',{
                title:'用户登录'
            })
            return
        }
        const {name, password} = ctx.request.body
        const user = await UserModel.findOne({name})
        //console.log(user)
        if (user && await bcrypt.compare(password, user.password)){
            ctx.session.user = {
                _id: user._id,
                name: user.name,
                isAdmin: user.isAdmin,
                email: user.email
            }
            ctx.redirect('/')
        }else{
            ctx.body = "用户名或密码错误"
        }
    },
    signout(ctx, next){
        ctx.session.user = null
        ctx.flash = {warning: '退出登录'}
        ctx.redirect('/')
    }
    
}