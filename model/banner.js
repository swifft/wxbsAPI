const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bannerSchema = new Schema({
        list:{
            type:Array
        }
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)


module.exports = banner = mongoose.model("banner", bannerSchema);