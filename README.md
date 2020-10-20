### 初始化项目
1. 需求说明，API 说明
- 根据客户端传递过来的不同的参数（状态/页码） 查询 任务的列表
- 实现 新增 一个任务的功能（名称/截至日期/内容）
- 实现一个 编辑 的功能：根据客户端传递的任务对象（已经存在的数据）进行编辑，（名称/截至日期/内容/ID）
- 删除一个任务（ID）
- 修改任务的状态（ID/状态--待办/完成）

2. 安装依赖
> npm install @hapi/joi lodash moment express mysql2 sequelize sequelize-cli body-parser -S
> npm install nodemon -D

``` cookie-parser debug http-errors ```

4. package.json
```
scripts:{
    "start":"nodemon src/app.js" // 启动方式：npm start 或 npm run start（因为 start 是默认的，所以可以省略 run）
}
```

### API 实现
1. 数据库的初始化
- 新建数据库 todo_development
- 使用 ```sequelize cli``` 初始化项目的数据库配置信息 ```npx sequelize init``` config 里面配置 database 的基本信息
- 生成模型文件
- 1. migrate 文件
- 2. model 文件
- ` npx sequelize model:generate --name Todo --attributes name:string,deadline:date,content:string `
- 3. 删掉 migrations 生成的 createdAt 和 updatedAt，models/todo.js timestamps:false

```

Todo.init({
    name: DataTypes.STRING,
    deadline: DataTypes.DATE,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Todo',
    timestamps:false
  });

```

- 4. 持久化，模型对应的[数据表] ` npx sequelize db:migrate `
- 5. 生成成功 导入模型

- 6. 表加字段，删除 todo 表,清空默认表，models/todo.js 增加 status:DataTypes.INTEGER
```
Todo.init({
    name: DataTypes.STRING,
    deadline: DataTypes.DATE,
    content: DataTypes.STRING,
    status:DataTypes.INTEGER // 数据类型 整数
}, {
    sequelize,
    modelName: 'Todo', //表名
    timestamps:false // 不要时间戳
});
```
> 执行：` npx sequelize db:migrate `
> 重新打开表就好了

### 其它笔记
1. 开发环境准备
- nodejs 和 npm 介绍
```
// 读取系统的 cpu 信息
const os = require('os')

const cpus = os.cpus(); // 获取当前系统的 cpu 数量(几核)
console.log(cpus.length)


// 获取内存信息
let total=os.totalmem()
console.log(total/1024/1024/1024) // 总内存 bytes 转 GB
let free=os.freemem()
console.log(free/1024/1024/1024) // 剩余内存 bytes 转 GB
console.log('free/total',parseInt(free/total*100)) // 剩余内存 百分比


// 显示当前系统的网络状况
console.log(os.networkInterfaces())


// web服务
// ajax --> api -- web server(nodejs)
const http=require('http')
const server=http.createServer((req,res)=>{
    res.end('hello')
})
let app=server.listen(3000,'127.0.0.1',()=>{
    console.log('服务启动成功',app)
})

/**
 * node src/test
 */
```
- nodejs 和 npm 介绍
> 通过JS使用 nodejs 暴露出来的 全局api 和 内置模块
> 第三方模块/包（通常都是通过 npm 来做的，也可以复制）
> v8 运行引擎，速度快
> libuv 开发包（异步io），文件读取 http 请求处理，都是通过 异步io 来实现的，实现了非阻塞，整个后台 js 都是通过事件驱动来完成的

- 介绍 nodemon，实现热启动，nodemon 自带 debug 启动
> 安装：` npm install nodemon -D `
> 修改启动命令："start":"nodemon src/app.js"
```
"scripts":{
    "start":"nodemon src/app.js",
    "start:debug":"DEBUG=* nodemon src/app.js",
    "start:node":"node src/app.js"
}
```
> 启动成功后 敲回车会重新启动，改任意文件都会重启启动
> 指定监听文件，新建 nodemon.json 改完需要重启 
```
{
    "watch":["./src/**/*.*"]
}
```

```
{
    "watch":["./src/**/*.js"]
}
```

- 使用 nrm 解决 npm 源的问题
> ` npm install nrm -g `
> ` npm ls `
> ` nrm -h `
> ` nrm current `
> ` nrm use taobao`

- 使用 nvm 管理 nodejs 版本问题
[nvm-windows](https://github.com/coreybutler/nvm-windows)
2. web 应用基础
- web 应用以及 express 介绍
- 路由（Routing）的介绍和使用
> ##### web 服务 如何处理一个请求
> - url-->网络-->dns解析-->目标服务器
>   - 如何相应这个请求--> 路由//规则
> - 请求的方法来区分
>   - get-->响应
>   - post-->post
> ##### 通过URI --> 路径
> - www.baidu.com/a/b/c/d.html

> 需要定义一个 api/路由
> 需要满足 客户端 无论使用什么请求方式（get/post/delete/put）都可以得到响应
> - app.all

> 无论客户端使用 任何的 uri，服务都能响应 --> 日志
> - app.all('*')
```
const express=require('express')
const app=express();

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
app.listen(3001,()=>{
    console.log('服务启动成功：http://localhost:3001')
})
```

- 中间件（MIDDLEWARE）介绍和使用
```
// 中间件这样用 等价于 app.all('/middle/api')
app.use('/middle/api',(req,res)=>{
    res.json({
        message:'from use demo',
        method:req.method
    })
})
```
- 中间件如何做路由拆分（express.Router）
> member sku order
```
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
```
- 自定义编写中间件 和 异常处理
```
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
```
- mysql 的安装和基本命令使用
> 参考 初始化项目
- ORM 框架 Sequelize 介绍和使用
> 参考 初始化项目