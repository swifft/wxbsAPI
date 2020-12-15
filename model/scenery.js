const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scenerySchema = new Schema({
        // 景点名字
        name: {
            type: String,
            require: true
        },
        // 景点英文名
        name_en: {
            type: String,
            require: true
        },
        // 景点概述
        survey: {
            type: String,
            require: true
        },
        // 景点图片集合
        imagesURL: {
            type: Array
        },
        // 景点用时建议
        time_propose: {
            type: String
        },
        // 景点交通建议
        traffic_propose: {
            type: String
        },
        // 景点优惠政策
        favoured_policy: {
            type: String
        },
        // 景点开放时间
        open_time: {
            type: String
        },
        // 景点信息更新时间
        survey_update_time: {
            type: Date
        },
        // 景点评分
        score: {
            type: String
        },
        // 景点人气
        popularity: {
            type: String
        },
        // 景点官方网站
        official_website: {
            type: String
        },
        // 景点官方电话
        official_phone: {
            type: String
        },
        // 景点服务设施
        service_facilities: {
            type: String
        },
        // 景点游玩贴士
        play_tips: {
            type: String
        },
        // 景点排名
        survey_sort: {
            type: String
        },
        // 景点星级
        survey_start: {
            type: Number
        },
        // 景点旅游时节
        travel_season: {
            type: String
        },
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)


module.exports = scenery = mongoose.model("scenery", scenerySchema);