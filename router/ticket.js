const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const Ticket = require('../model/ticket')
const scenery = require('../model/scenery')

// PC端
router.get('/list', (req, res) => {
    Ticket.find({}).populate('sceneryId').then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.post('/add', (req, res) => {
    const newTicket = new Ticket({
        ticket_info:req.body.ticket_info,
        sceneryId:req.body.sceneryId
    })

    newTicket.save().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.post('/edit', (req, res) => {
    const newData = {
        'ticket_info':req.body.ticket_info,
    }

    Ticket.findByIdAndUpdate(req.body._id,newData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
    })
})

router.get('/detail', (req, res) => {
    Ticket.findOne({'_id':req.query.id}).then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

// 小程序端
router.get('/detailById', (req, res) => {
    Ticket.findOne({'sceneryId':req.query.sceneryId},{'ticket_info':1}).then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get('/getList', (req, res) => {
    Ticket.find({}).populate('sceneryId').then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})


module.exports = router