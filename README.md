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

