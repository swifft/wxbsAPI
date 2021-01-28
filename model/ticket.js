const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new Schema({
        //门票类型 （例如：全日票）
        ticket_info:{
            type:Array
            // 数组涉及字段名
            //票价类型 （例如：标准价，XXX特惠）
            //price_type
            //票务小提示（例如：需取票、有条件）
            //tips
            //已售数
            //sold_counts
            //票价
            //price
        },
        sceneryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'scenery'
        }
    }, {
        timestamps: {
            createdAt: 'create_time',
            updatedAt: 'update_time'
        }
    }
)

module.exports = Ticket = mongoose.model("ticket", TicketSchema);