const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
        wxUser_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'wxUser'
        },
        contentHtml: {
            type: String
        },
        contentText: {
            type: String
        },
        imagesURL: {
            type: Array
        },
        address: {
            type: String
        },
        // 审核状态： 0 未审核 /  1 审核中 /  2 审核通过 / 3 审核未通过
        status: {
            type: Number
        },
        // 额外附带信息 如 审核不通过原因等
        statusTips: {
            type: String
        }
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)


module.exports = Record = mongoose.model("Record", RecordSchema);