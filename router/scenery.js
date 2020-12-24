const express = require('express');
const router = express.Router();
const {successMsg, errorMsg} = require('../untils/returnMsg')
const request = require('request')
const scenery = require('../model/scenery')


//PC 端后台管理系统接口

router.get('/getExpression', (req, res) => {
    request({
        url: 'https://api.weibo.com/2/emotions.json?source=1362404091',
        method: 'GET',
        headers: {'Content-Type': 'text/json'}
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            res.json(successMsg(JSON.parse(body)));
        }
    })
})

router.post('/save', (req, res) => {
    scenery.findOne({s_id:req.body.s_id}).then(user=>{
        if (user){
            res.json(errorMsg("该景点id已存在"))
        }else {
            const newData = new scenery({
                // 景点名字
                name: req.body.name,
                // 景点英文名字
                name_en: req.body.name_en,
                // 景点id
                s_id: req.body.s_id,
                // 景点经度
                longitude: req.body.longitude,
                // 景点纬度
                latitude: req.body.latitude,
                // 景点地址
                address: req.body.address,
                // 景点人气排行
                hotSort: req.body.hotSort,
                // 景点代言词
                pronoun: req.body.pronoun,
                // 景点级别
                rank: req.body.rank,
                // 景点热度
                heat: req.body.heat,
                // 景点概述
                survey: req.body.survey,
                // 景点图片集合
                imagesURL: req.body.imagesURL || null,
                // 景点用时建议
                time_propose: req.body.time_propose || null,
                // 景点交通建议
                traffic_propose: req.body.traffic_propose || null,
                // 景点优惠政策
                favoured_policy: req.body.favoured_policy || null,
                // 景点开放时间
                open_time: req.body.open_time || null,
                // 景点信息更新时间
                survey_update_time: req.body.survey_update_time || null,
                // 景点评分
                score: req.body.score || null,
                // 景点人气
                popularity: req.body.popularity || null,
                // 景点官方网站
                official_website: req.body.official_website || null,
                // 景点官方电话
                official_phone: req.body.official_phone || null,
                // 景点服务设施
                service_facilities: req.body.service_facilities || null,
                // 景点游玩贴士
                play_tips: req.body.play_tips || null,
                // 景点排名
                survey_sort: req.body.survey_sort || null,
                // 景点星级
                survey_start: req.body.survey_start || null,
                // 景点旅游时节
                travel_season: req.body.travel_season || null,
            })

            newData.save().then(doc =>{
                res.json(successMsg(doc))
            }).catch(error =>{
                res.json(errorMsg(error))
            })
        }
    })
})

router.post('/edit', (req, res) => {
    const newData = {
        // 景点名字
        'name': req.body.name,
        // 景点英文名字
        'name_en': req.body.name_en,
        // 景点id
        's_id': req.body.s_id,
        // 景点经度
        'longitude': req.body.longitude,
        // 景点纬度
        'latitude': req.body.latitude,
        // 景点地址
        'address': req.body.address,
        // 景点人气排行
        'hotSort': req.body.hotSort,
        // 景点代言词
        'pronoun': req.body.pronoun,
        // 景点级别
        'rank': req.body.rank,
        // 景点热度
        'heat': req.body.heat,
        // 景点概述
        'survey': req.body.survey,
        // 景点图片集合
        'imagesURL': req.body.imagesURL,
        // 景点用时建议
        'time_propose': req.body.time_propose,
        // 景点交通建议
        'traffic_propose': req.body.traffic_propose,
        // 景点优惠政策
        'favoured_policy': req.body.favoured_policy,
        // 景点开放时间
        'open_time': req.body.open_time,
        // 景点信息更新时间
        'survey_update_time': req.body.survey_update_time,
        // 景点评分
        'score': req.body.score,
        // 景点人气
        'popularity': req.body.popularity,
        // 景点官方网站
        'official_website': req.body.official_website,
        // 景点官方电话
        'official_phone': req.body.official_phone,
        // 景点服务设施
        'service_facilities': req.body.service_facilities,
        // 景点游玩贴士
        'play_tips': req.body.play_tips,
        // 景点排名
        'survey_sort': req.body.survey_sort,
        // 景点星级
        'survey_start': req.body.survey_start,
        // 景点旅游时节
        'travel_season': req.body.travel_season,
    }

    scenery.findByIdAndUpdate(req.body._id,newData,{new : true},(err, doc)=>{
        if (err){
            res.json(errorMsg(err))
        }else {
            res.json(successMsg(doc))
        }
    })
})

router.get("/getSceneryLocation",(req,res)=>{
    request({
        url: encodeURI('http://api.map.baidu.com/geocoding/v3/?city=桂林市&output=json&ak=fgbYf5TN6ySeyrLjjzkQjl7WvtRANnNP&address=' + req.query.sceneryName + '景区'),
        method: 'GET',
        headers: {'Content-Type': 'text/javascript;charset=utf-8'}
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const newData = JSON.parse(body)
            const data = {
                location:newData.result.location,
                info:newData.result.level === '旅游景点'? '信息查询准确' : '信息不一定准确'
            }
            res.json(successMsg(data));
        }
    })
})

//小程序端正式接口

router.get('/hotSearch',(req, res)=>{
    const keyWordsRegExp = new RegExp(req.query.keyWords,'i')
    scenery.find({
        $or:[
            {name:{$regex:keyWordsRegExp}},
            {name_en:{$regex:keyWordsRegExp}},
            {survey:{$regex:keyWordsRegExp}}
        ]
    }).then(doc =>{
        res.json(successMsg(doc))
    }).catch(err =>{
        res.json(errorMsg(err))
    })
})

router.get('/getHotSort',(req, res)=>{
    scenery.find({}).sort({'hotSort':1}).limit(5).then(doc =>{
        res.json(successMsg(doc))
    }).catch(err =>{
        res.json(errorMsg(err))
    })
})

// 分页查询
    router.get('/getHotSortAll',(req, res)=>{
    const page = req.query.page
    const limit = req.query.pageLimit
    scenery.find({}).skip((page - 1)*parseInt(limit)).sort({'hotSort':1}).limit(parseInt(limit)).then(doc =>{
        res.json(successMsg(doc))
    }).catch(err =>{
        res.json(errorMsg(err))
    })
})

router.get('/getSurveySort',(req, res)=>{
    scenery.find({}).sort({'survey_sort':1}).then(doc =>{
        res.json(successMsg(doc))
    }).catch(err =>{
        res.json(errorMsg(err))
    })
})

// 小程序和PC后台管理系统通用
router.get('/getList',(req, res)=>{
    if (req.query.id){
        scenery.findOne({'_id':req.query.id}).then(doc =>{
            res.json(successMsg(doc))
        }).catch(err =>{
            res.json(errorMsg(err))
        })
    }else {
        scenery.find().then(doc =>{
            res.json(successMsg(doc))
        }).catch(err =>{
            res.json(errorMsg(err))
        })
    }
})

module.exports = router