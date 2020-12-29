const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const records = require('../model/records')

router.post("/save",(req, res)=>{
    const newRecord = new records({
        wxUser_id: req.body.wxUser_id,
        contentHtml: req.body.contentHtml,
        contentText: req.body.contentText,
        imagesURL: req.body.imagesURL,
        address: req.body.address,
        // 审核状态： 0 未审核 /  1 审核中 /  2 审核通过 / 3 审核未通过
        status: req.body.status,
        // 额外附带信息 如 审核不通过原因等
        statusTips: req.body.statusTips
    })

    newRecord.save().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get("/getAll",(req, res)=>{
    records.find().sort({'create_time':-1}).populate('wxUser_id').then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get("/getAllByUser",(req, res)=>{
    records.find({'wxUser_id':req.query.wxUser_id}).sort({'create_time':-1}).then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get("/getDetailRecordById",(req, res)=>{
    records.findOne({'_id':req.query.id}).populate('wxUser_id').then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

module.exports = router;