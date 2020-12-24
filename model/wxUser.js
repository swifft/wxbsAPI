const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wxUserSchema = new Schema({
        account: {
            type: String
        },
        password: {
            type: String
        },
        avatarUrl: {
            type: String
        },
        nickName: {
            type: String
        },
        sex: {
            type: String
        },
        userId: {
            type: String
        },
        openId: {
            type: String
        }
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)


module.exports = wxUser = mongoose.model("wxUser", wxUserSchema);