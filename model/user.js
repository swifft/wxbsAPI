const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    account: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    // 用户权限 0:普通管理员  1:超级管理员
    authority: {
        type: Number,
        default: 0
    },
    // 账号状态 0:禁用  1:启用
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
}
)


module.exports = User = mongoose.model("user", UserSchema);