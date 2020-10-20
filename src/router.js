const express=require('express')
const { method } = require('lodash')
/**********************************************************************/
const memberRouter=express.Router()
// router 包含的三种方法
/**
 * router
 *  .[method]// get post
 * router.all
 * router.use
 */

memberRouter.get('/list',(req,res)=>{
    res.json({
        list:[
            {
                id:1,
                name:'张三'
            }
        ]
    })
})
// module.exports=memberRouter
/**********************************************************************/
const skuRouter=express.Router()
skuRouter.get('/list',(req,res)=>{
    res.json({
        list:[
            {
                id:2,
                price:100,
                name:'鞋子'
            }
        ]
    })
})
// module.exports=skuRouter
/**********************************************************************/
// 路由注册
const app=express()
// const memberRouter=require('./member')
// 这样注册请求方式为 /list
// app.use(memberRouter)
// 这样注册请求方式为 /list
app.use('/member',memberRouter)
// 这样注册请求方式为 /sku/list
app.use('/sku',skuRouter)
app.listen(3002,(req,res)=>{
    console.log('服务启动成功：http://localhost:3002')
})