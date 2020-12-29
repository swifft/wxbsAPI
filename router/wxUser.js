const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const wxUser = require('../model/wxUser')
const jwt = require('../untils/tokenFun')
const request = require('request')

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
                            token: data
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
                        sex: null,
                        userId: userId,
                        openId: openId
                    })

                    newUser.save().then((doc) =>{
                        jwt.setToken(userId).then(data => {
                            const userInfo = {
                                userInfo: doc,
                                token: data
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

module.exports = router;