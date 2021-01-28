const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
        // 记录id
        recordId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Record'
        },
        // 用户id
        wxUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'wxUser'
        },
        // 评论内容
        content:{
            type: String,
        },
        // 评论时间
        time:{
            type: Date,
            default: new Date()
        },
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)

module.exports = Comment = mongoose.model("comment", CommentSchema);