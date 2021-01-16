const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const System = require('../model/system')
const moment = require('moment');
const os = require('os')

// 获取当天http请求统计
router.get('/getSystem', (req, res) => {
    const date = moment().format('Y-MM-D');
    const time = {
        fromTime: date + ' 00:00:00',
        toTime: moment().utcOffset(8).format('Y-MM-D H:mm:ss')
    }
    System.findOne({ date: date }).then(result => {
        res.json(successMsg({ result, total: result.getCount + result.postCount, time: time }))
    }).catch(error => {
        res.json(errorMsg(error))
    })
})

// 获取所有http请求统计
router.get('/getSystemAll', (req, res) => {
    const date = moment().format('Y-MM-D');
    const time = {
        fromTime: date + ' 00:00:00',
        toTime: moment().utcOffset(8).format('Y-MM-D H:mm:ss')
    }
    System.find().then(result => {
        res.json(successMsg({ result, time: time }))
    }).catch(error => {
        res.json(errorMsg(error))
    })
})

// 获取当天访客统计
router.get('/getVisitTotal', (req, res) => {
    const date = moment().format('Y-MM-D');
    System.findOne({ date: date }, { 'visitTotal': 1 }).then(result => {
        res.json(successMsg({ count: result.visitTotal.length }))
    }).catch(error => {
        res.json(errorMsg(error))
    })
})

// 获取所有访客统计
router.get('/getVisitTotalAll', (req, res) => {
    System.find({ }, { 'visitTotal': 1 }).then(result => {
        res.json(successMsg(result))
    }).catch(error => {
        res.json(errorMsg(error))
    })
})

// 获取运行天数
router.get('/getRunTime', (req, res) => {
    const date = moment().diff(moment('2020-8-31'), 'days')
    res.json(successMsg(date))
})

// 获取系统信息
router.get('/getSystemInfo', (req, res) => {
    const info = {
        platform: os.platform(),
        freemem: parseInt(os.freemem() / 1024 / 1024) + 'M',
        totalmem: parseInt(os.totalmem() / 1024 / 1024) + 'M'
    }
    res.json(successMsg(info))
})

// 获取统计信息
router.get('/getVitalInfo', (req, res) => {
    System.find({}).then(result => {
        res.json(successMsg(result))
    }).catch(error => {
        res.json(errorMsg(error))
    })
})

module.exports = router;