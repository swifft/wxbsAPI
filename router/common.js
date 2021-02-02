const express = require('express');
const router = express.Router();
const {successMsg, errorMsg} = require('../untils/returnMsg')
const request = require('request')
const banner = require('../model/banner')

router.post("/saveBanner", (req, res)=>{
    const newData = new banner({
        list:req.body.list
    })

    newData.save().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.post("/editBanner", (req, res)=>{
    const newData ={
        list:req.body.list
    }

    banner.findByIdAndUpdate(req.body._id,newData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
    })
})

router.get("/getAllBannerPC", (req, res)=>{
    banner.find().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get("/getAllBanner", (req, res)=>{
    banner.find().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

router.get('/getHotelList', (req, res) => {
    const distanceType = req.query.distanceType
    if (distanceType) {
        request({
            url: 'https://restapi.amap.com/v3/place/around?key=dd4223750904121cdfeed886afab03ab&location=' + req.query.lat + ',' + req.query.lng + '&types=100000&extensions=all&offset=10&page=' + req.query.pageNum +'&sortrule=weight',
            method: 'GET',
            headers: {'Content-Type': 'text/json'}
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.json(successMsg(JSON.parse(body)));
            }
        })
    } else {
        request({
            url: 'https://restapi.amap.com/v3/place/around?key=dd4223750904121cdfeed886afab03ab&location=' + req.query.lat + ',' + req.query.lng + '&types=100000&extensions=all&offset=10&page=' + req.query.pageNum,
            method: 'GET',
            headers: {'Content-Type': 'text/json'}
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.json(successMsg(JSON.parse(body)));
            }
        })
    }
})

//废弃
// router.get('/getHotelDetail', (req, res) => {
//     request({
//         url: 'http://api.map.baidu.com/place/v2/detail?uid=' + req.query.uid + '&output=json&scope=2&ak=fgbYf5TN6ySeyrLjjzkQjl7WvtRANnNP',
//         method: 'GET',
//         headers: {'Content-Type': 'text/json'}
//     }, (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//             res.json(successMsg(JSON.parse(body)));
//         }
//     })
// })


module.exports = router