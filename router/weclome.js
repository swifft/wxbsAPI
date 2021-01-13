const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const systemModel = require('../model/system')
const moment = require('moment');

// 查询当前ip是否写入记录
router.get('/', (req, res) => {
    let ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0];
    }
    const date = moment().format('Y-MM-D');
    systemModel.findOne({ date: date }).then(result => {
        if (result) {
            const ls = result.visitTotal.includes(ip.toString())
            if (ls === false) {
                systemModel.findOneAndUpdate(
                    { _id: result._id },
                    { $push: { 'visitTotal': ip.toString() } }
                ).then(doc => {
                    return true
                })
                res.json(successMsg(null,{msg:`写入成功，ip为${ip.toString()}`}))
            } else {
                res.json(successMsg(null, { msg: '已存在该ip的访问记录' }))
            }
        } else {
            const systemInfo = new systemModel({
                date:date,
                postCount: 0,
                getCount: 1,
                visitTotal:[ip.toString()]
            })

            systemInfo.save().then((result) => {
                res.json(successMsg(null,{msg:`写入成功，ip为${ip.toString()}`}))
            }).catch((error) => {
                res.json(errorMsg(error))
            })
        }
    })
})

// 查询当日访问记录
router.get('/record', (req, res) => {
    const date = moment().format('Y-MM-D');
    const time = moment().format('Y-MM-DD HH:mm:ss');
    systemModel.findOne({ date: date }, { 'visitTotal': 1, 'date': 1 }).then(result => {
        res.json(successMsg({ '今日访问记录': result.visitTotal.length, '截止时间': time }))
    })
})

module.exports = router;