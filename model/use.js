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
    }
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
}
)


module.exports = User = mongoose.model("user", UserSchema);