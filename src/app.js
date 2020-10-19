const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const models = require('../models')
const {
    sequelize
} = require('../models')
// {
//     [model:Todo],
//     sequelize,
//     sequelize
// }

app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

// 1. 所有的错误，http status == 500

// 创建 todo
app.post('/create', async (req, res, next) => {
    try {
        let {
            name,
            deadline,
            content
        } = req.body
        // 数据持久化到数据库
        let todo = await models.Todo.create({
            name,
            deadline,
            content
        })
        res.json({
            todo,
            name,
            deadline,
            content
        })
    } catch (error) {
        next(error)
    }
})
// 修改 todo
app.post('/update', async (req, res, next) => {
    try {
        let {
            name,
            deadline,
            content,
            id
        } = req.body
        let todo = await models.Todo.findOne({
            id
        })
        if (todo) {
            todo = await todo.update({
                name,
                deadline,
                content,
                id
            })
        }
        res.json({
            todo,
            name,
            deadline,
            content,
            id
        })
    } catch (error) {
        console.log(error)
    }
})
// 修改 todo status
app.post('/update_status', async (req, res, next) => {
    try{
        let {
            status,
            id
        } = req.body
        let todo=await models.Todo.findOne({id})
        if(todo && status != todo.status){
            todo=await todo.update({id,status})
        }
        res.json({
            todo,
            status,
            id
        })
    }catch(error){
        next(error)
    }
})

// 查询任务列表
app.get('/list/:status/:page', async (req, res, next) => {
    let {status,page}=req.params
    let limit=20
    let offset = (page-1)*limit
    let where={}
    if(status==-1){
        where.status=status
    }
    // 1. 状态 1 表示代办 2 表示完成 3 表示删除 -1 全部
    // 2. 分页的处理
    let list=await models.Todo.findAndCountAll({
        where,
        offset,
        limit
    })
    res.json({
        list,
        message:'列表查询完成'
    })
})

// 捕获异常中间件
app.use((err, req, res, next) => {
    if (err) {
        res.status(500)
            .json({
                message: err.message
            })
    }
})

app.listen(3000, () => {
    console.log('服务启动成功：http://localhost:3000')
})