const express = require('express');
const router = express.Router();
const User = require('../model/user');
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
                password: bcrypt.encryption(req.body.password),
                authority: req.body.authority
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
        res.json(successMsg(null, { msg: '用户不存在' }))
    })
})

// 获取所有用户信息
router.post('/editAuthority', (req, res) => {
    const newData = {
        'account': req.body.account,
        'authority': req.body.authority
    }

    User.findByIdAndUpdate(req.body._id,newData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
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