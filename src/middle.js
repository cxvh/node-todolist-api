const express=require('express')
const app=express()
// 中间件完整的结构
// 1. 是一个函数
// 2. err,req,res,next-->is func

function demo_middleware(err,req,res,next){
    // 1. 异常
    // 2. 处理下业务功能，然后转交控制权--next
    // 3. 响应请求--结束响应-->当作路由的处理函数
}

function log_middleware(req,res,next){
    console.log('请求来了。。。')
    next()
}
app.use(log_middleware)

// http://localhost:3000/
app.use(express.static('static',{
    extensions:['html','htm']
}))

// http://localhost:3000/test?name=1
function valid_name_middleware(req,res,next){
    let {name}=req.query
    if(!name){
        res.json({
            message:'缺少 name 参数'
        })
    }else{
        next()
    }
}

app.all('*',valid_name_middleware)

// route
app.get('/test',(req,res)=>{
    res.json({
        message:'test'
    })
})


const userRouter=express.Router()
userRouter.use(function(req,res,next){
    console.log('log from route')
    next()
})
function valid_login_params(req,res,next){
    let {code}=req.query
    if(!code){
        res.json({
            message:'验证码不能为空'
        })
    }else{
        next()
    }
}
userRouter.get('/login',[valid_login_params,/* middleware */],(req,res)=>{
    let {formdata}=req
    res.json({
        formdata,
        message:'from route login'
    })
})
// app.use(userRouter)
app.use('/user',userRouter) // http://localhost:3000/user/login?name=1&code=1

// 404
app.use((err, req, res, next) => {
    res.json({
        message: 'api 不存在'
    })
})
// 捕获异常中间件
app.use((err, req, res, next) => {
    if (err) {
        const {message}=err
        res.status(500)
            .json({
                message: message||'服务器异常'
            })
    }
})
app.listen(3000,()=>{
    console.log('服务启动成功：http://localhost:3000')
})