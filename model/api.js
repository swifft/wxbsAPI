const mongoose = require('mongoose')
const Schema = mongoose.Schema

const APISchema = new Schema({
    url: {
        type: String,
        require: true
    },
    sort: {
        type: String,
        require: true
    },
    methods: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    isAuthorization: {
        type: Boolean,
        required: true
    },
    prefix:{
        type: String,
        required: true
    },
    //用于接口使用类型，0为PC端，1为小程序端
    type: {
        type: Number,
        required: true
    },
    extraInfo: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
}
)


module.exports = API = mongoose.model("api", APISchema);