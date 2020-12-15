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
        type: Object,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time'
    }
}
)


module.exports = API = mongoose.model("api", APISchema);