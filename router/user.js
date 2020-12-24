const express = require('express');
const router = express.Router();
const User = require('../model/use');
const { successMsg, errorMsg } = require('../untils/returnMsg')
const jwt = require('../untils/tokenFun')
const bcrypt = require('../untils/bcrypt')
const System = require('../untils/systemConfig')
const request = require('request')

// 用户注册
router.post('/register', (req, res) => {
    System.totalCount('post')
    User.findOne({ account: req.body.account }).then(user => {
        if (user) {
            res.json(errorMsg(null, { msg: '用户名已存在' }))
        } else {
            const newData = new User({
                account: req.body.account,
                password: bcrypt.encryption(req.body.password)
            })

            newData.save().then((result) => {
                res.json(successMsg(result))
            }).catch((error) => {
                res.json(errorMsg(error))
            })
        }
    })
})

// 用户登录
router.post('/login', (req, res) => {
    System.totalCount('post')
    User.findOne({ account: req.body.account }).then((user) => {
        const vertifyPassword = bcrypt.verification(req.body.password, user.password)
        if (vertifyPassword) {
            jwt.setToken(user._id).then(data => {
                const userinfo = {
                    userInfo: user,
                    token: data
                }
                res.json(successMsg(userinfo))
            })
        } else {
            res.json(successMsg(null, { msg: '密码错误' }))
        }
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

// 获取所有用户信息
router.get('/getUser', (req, res) => {
    System.totalCount('get')
    User.find().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

module.exports = router;