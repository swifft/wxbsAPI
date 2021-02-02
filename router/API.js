const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const API = require('../model/api')

router.post('/add', (req, res) => {
    const newAPI = new API({
        url: req.body.url,
        sort: req.body.sort,
        methods: req.body.methods,
        desc: req.body.desc,
        type: req.body.type,
        isAuthorization: req.body.isAuthorization,
        prefix: req.body.prefix,
        extraInfo: req.body.extraInfo || null
    })

    API.findOne({'url':req.body.url}).then(api =>{
        if (api){
            res.json(successMsg("该接口已存在"))
        }else {
            newAPI.save().then(result => {
                res.json(successMsg(result))
            }).catch(err => {
                res.json(errorMsg(err))
            })
        }
    })
})

router.post('/edit', (req, res) => {
    const newData = {
        'url': req.body.url,
        'sort': req.body.sort,
        'methods': req.body.methods,
        'desc': req.body.desc,
        'type': req.body.type,
        'isAuthorization': req.body.isAuthorization,
        'prefix': req.body.prefix,
        'extraInfo': req.body.extraInfo
    }

    API.findByIdAndUpdate(req.body._id,newData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
    })
})

router.get('/getDetailById', (req, res) => {
    API.findById(req.query.id).then(result =>{
        res.json(successMsg(result))
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

router.get('/PC', (req, res) => {
    API.find({ 'type': 0 }).distinct('sort').then(result => {
        res.json(successMsg(result))
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

router.get('/miniApp', (req, res) => {
    API.find({ 'type': 1 }).distinct('sort').then(result => {
        res.json(successMsg(result))
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

router.get('/allApiBySort', (req, res) => {
    API.find({ 'sort': req.query.sort,'type': req.query.type }).then(result => {
        res.json(successMsg(result))
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

router.get('/total', (req, res) => {
    let result = {}
    API.find({ 'methods': 'POST' }).then(res_p => {
        result.post = res_p.length
        API.find({ 'methods': 'GET' }).then(res_g => {
            result.get = res_g.length
            API.find({}).then(res_a => {
                result.total = res_a.length
                res.json(successMsg(result))
            }).catch(err => {
                res.json(errorMsg(err))
            })
        }).catch(err => {
            res.json(errorMsg(err))
        })
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

module.exports = router