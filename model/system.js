const mongoose = require('mongoose')
const Schema = mongoose.Schema

const systemSchema = new Schema({
        date:{
            type:String
        },
        postCount: {
            type: Number
        },
        getCount: {
            type: Number
        },
        visitTotal:{
            type:Array,
            default:null
        }
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)


module.exports = system = mongoose.model("system", systemSchema);