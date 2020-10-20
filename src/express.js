const express=require('express')
const app=express();
// app--->Application--->web 服务的实例

// 1. 通过 请求的 方法类型 get/post/put/delete
app.get('/demo',(req,res)=>{
    // req:请求对象
    // res:服务响应对象
    res.json({
        message:'express route from get demo'
    })
})
app.post('/demo',(req,res)=>{
    // req:请求对象
    // res:服务响应对象
    res.json({
        message:'express route from post demo'
    })
})
// 2. 通过 uri
app.get('/user/byname',(req,res)=>{
    let {name}=req.query
    res.json({
        name
    })
})
app.get('/user/byid',()=>{
    let {id}=req.query
    res.json({
        id
    })
})

// 3. app.all 支持包括 get,post,delete,put 等所有方法
app.all('/test',(req,res)=>{
    res.json({
        message:'test app.all',
        method:req.method
    })
})
// 4. 无论客户端使用 任何的 uri，服务都能响应 --> 日志
app.all('*',(req,res)=>{
    res.json({
        message:'test app.all',
        method:req.method,
        uri:req.path
    })
})

// 中间件这样用 等价于 app.all('/middle/api')
app.use('/middle/api',(req,res)=>{
    res.json({
        message:'from use demo',
        method:req.method
    })
})


app.listen(3001,()=>{
    console.log('服务启动成功：http://localhost:3001')
})