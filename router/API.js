const express = require('express');
const router = express.Router();
const { successMsg, errorMsg } = require('../untils/returnMsg')
const API = require('../model/api')

router.post('/add', (req, res) => {
    const newAPI = new API({
        url: req.body.url,
        sort: req.body.sort,
        methods: req.body.methods,
        desc: req.body.desc
    })

    newAPI.save().then(result => {
        res.json(successMsg(result))
    }).catch(err => {
        res.json(errorMsg(err))
    })
})

router.get('/', (req, res) => {
    var returnData = []
    API.find({}, { 'sort': 1 }).distinct('sort').then(result => {
        for (let i = 0; i < result.length; i++) {
            API.find({ 'sort': result[i] }, { 'sort': 0 }).exec(function (err, doc) {
                returnData[i] = {
                    sort: result[i],
                    data: doc
                }
                if (i === result.length - 1) {
                    res.json(successMsg(returnData))
                }
            })
        }
    })
})

module.exports = router