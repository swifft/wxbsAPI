const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const wxUser = require('../model/wxUser')
const jwt = require('../untils/tokenFun')
const request = require('request')
const nodemailer = require('nodemailer')
const moment = require('moment');
const bcrypt = require('../untils/bcrypt')

//微信授权登录
router.post("/authLogin",(req, res)=>{
    const code = req.body.code
    request({
        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx98c5e1eece849cd0&secret=7ec3c116ded9e432ed1d459a75a01439&js_code=' + code + '&grant_type=authorization_code',
        method: 'GET',
        headers: {'Content-Type': 'text/json'}
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const openId = JSON.parse(body).openid

            // 检测是否存在登录用户
            wxUser.findOne({ openId: openId }).then((user)=>{
                if (user){
                    jwt.setToken(user.userId).then(data => {
                        const userInfo = {
                            userInfo: user,
                            token: data,
                            loginType: 'ByWX'
                        }
                        res.json(successMsg(userInfo))
                    })
                }else {
                    const userId = new Date().getTime() + + Math.floor(Math.random()*1000)
                    const newUser = new wxUser({
                        account: null,
                        password: null,
                        avatarUrl: req.body.avatarUrl,
                        nickName: req.body.nickName,
                        sex: '男',
                        userId: userId,
                        openId: openId
                    })

                    newUser.save().then((doc) =>{
                        jwt.setToken(userId).then(data => {
                            const userInfo = {
                                userInfo: doc,
                                token: data,
                                loginType: 'ByWX'
                            }
                            res.json(successMsg(userInfo))
                        })
                    }).catch((error) => {
                        res.json(errorMsg(error))
                    })
                }
            })
        }
    })
})

//微信个人信息修改
router.post("/editUserInfo",(req, res)=>{
    const editData = {
        avatarUrl: req.body.avatarUrl,
        nickName: req.body.nickName,
        sex: req.body.sex
    }

    wxUser.findByIdAndUpdate(req.body.id,editData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
    })
})

// 验证码获取
router.get("/getVerifyCode",(req, res)=>{
    //随机验证码
    const charStr ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verifyCode = "";
    for(let i=0; i<6; i++){
        const index = Math.round(Math.random() * (charStr.length-1));
        verifyCode += charStr.substring(index,index+1);
    }
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        service: 'qq',
        secure: true,
        auth: {
            user: '1729066749@qq.com',
            pass: 'mqebprmsmvzpbaii' // QQ邮箱需要使用授权码
        }
    });
    let mailOptions = {
        from: '桂林旅游小程序<1729066749@qq.com>', // 发件人
        to: req.query.email, // 收件人
        subject: '验证码', // 主题
        html: `<h3>验证码是: ${verifyCode}</h3>  <p>注：有效期24小时</p>`, // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        const res_data = {
            verifyCode:verifyCode,
            start_time:moment().format('YYYY-MM-DD HH:mm:ss'),
            end_time:moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        res.json(successMsg(res_data,{msg:'发送成功'}))
    });
})

router.get('/loginByVerifyCode',(req, res)=>{
    wxUser.findOne({'account':req.query.account}).then((user)=>{
        if (user){
            jwt.setToken(user.userId).then(data => {
                const userInfo = {
                    userInfo: user,
                    token: data,
                    loginType: 'ByAccount'
                }
                res.json(successMsg(userInfo))
            })
        }else {
            const userId = new Date().getTime() + + Math.floor(Math.random()*1000)
            const newUser = new wxUser({
                account: req.query.account,
                password: bcrypt.encryption('123456'),
                avatarUrl: 'https://file.gxnudsl.xyz/image/wxbs/static/common/avatar.png',
                nickName: `用户${userId}`,
                sex: '男',
                userId: userId,
                openId: null
            })
            newUser.save().then((doc) =>{
                jwt.setToken(userId).then(data => {
                    const userInfo = {
                        userInfo: doc,
                        token: data,
                        loginType: 'ByAccount'
                    }
                    res.json(successMsg(userInfo))
                })
            }).catch((error) => {
                res.json(errorMsg(error))
            })
        }
    })
})

router.post('/loginByAccount',(req, res)=>{
    wxUser.findOne({'account':req.body.account}).then((user)=>{
        const vertifyPassword = bcrypt.verification(req.body.password, user.password)
        if (vertifyPassword) {
            jwt.setToken(user.userId).then(data => {
                const userInfo = {
                    userInfo: user,
                    token: data,
                    loginType: 'ByAccount'
                }
                res.json(successMsg(userInfo))
            })
        }else {
            res.json(errorMsg(null, { msg: '密码错误' }))
        }
    }).catch((error) => {
        res.json(errorMsg(null, { msg: '用户不存在' }))
    })
})

router.post('/editPassword',(req, res)=>{
    wxUser.findOne({'_id':req.body.id}).then((user)=>{
        const vertifyPassword = bcrypt.verification(req.body.oldPassword, user.password)
        if (vertifyPassword) {
            const newData = {
                'password': bcrypt.encryption(req.body.password)
            }
            wxUser.findByIdAndUpdate(req.body.id,newData,{new : true},(err, doc)=>{
                if (err){
                    res.json(errorMsg(err))
                }else {
                    res.json(successMsg(doc))
                }
            })
        }else {
            res.json(errorMsg(null, { msg: '原密码密码不正确' }))
        }
    }).catch((error) => {
        res.json(errorMsg(null, { msg: '用户不存在' }))
    })
})

module.exports = router;