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