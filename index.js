const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require("mongoose");
const expressJwt = require('express-jwt')
const vertoken = require('./untils/tokenFun');
const { errorMsg } = require('./untils/returnMsg');
const baseConfig = require('./config/base');
const fs = require('fs')

app.listen(200)


app.get('/',(req, res)=>{
    fs.readFile('./doc/index.htm','utf-8',(err,data)=>{
        if (err){
            res.json(err)
        }else {
            res.end(data)
        }
    })
})

//设置允许跨域访问该服务.
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 数据库配置
mongoose.connect('mongodb://localhost:27017/wxbs', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("数据库连接成功"))
    .catch(err => console.log(err))
mongoose.set('useFindAndModify', false)

// 中间件配置
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//解析token获取用户信息
app.use(function (req, res, next) {
    const token = req.headers['authorization'];
    if (token == undefined) {
        return next();
    } else {
        vertoken.getToken(token).then((data) => {
            req.token = data;
            return next();
        }).catch((error) => {
            return next();
        })
    }
});

//自动化路由验证token是否过期
app.use(expressJwt({
    secret: baseConfig.tokenScrect,
    algorithms: ['HS256']
}).unless({
    path: [
        '/api/v1/user/login',
        '/api/v1/user/register',
        '/api/v1/user/wxLogin',
        '/api/v1/scenery/getList',
        '/api/v1/scenery/hotSearch',
        '/api/v1/scenery/getSceneryLocation',
        '/api/v1/scenery/getHotSort',
        '/api/v1/scenery/getSurveySort',
        '/api/v1/scenery/getHotSortAll'
    ]
}))

//分模块编写接口
app.use("/api/v1/user", require("./router/user"));
app.use("/api/v1/system", require("./router/getBase"));
app.use("/api/v1/welcome", require("./router/weclome"));
app.use("/api/v1/getAPI", require("./router/API"));
app.use("/api/v1/scenery", require("./router/scenery"));

//token失效统一返回
app.use(function (err, req, res, next) {
    if (err.status == 401) {
        return res.status(401).json(errorMsg(null, { msg: '身份信息已失效,请重新登陆', code: 401 }))
    }
})