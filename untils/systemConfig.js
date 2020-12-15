const System = require('../model/system')
const moment = require('moment');

function totalCount(type) {
    const date = moment().format('Y-MM-D');
    System.findOne({date:date}).then(result=>{
        if (result){
            if (type === 'post'){
                System.findOneAndUpdate({_id:result._id},{$inc:{"postCount":1}},{'new':true}).then(result =>{
                    return true
                })
            }else if (type === 'get'){
                System.findOneAndUpdate({_id:result._id},{$inc:{"getCount":1}},{'new':true}).then(result =>{
                    return true
                })
            }
        }else {
            const systemInfo = new System({
                date:date,
                postCount: type === 'post' ? 1 : 0,
                getCount:type === 'get' ? 1 : 0,
            })

            systemInfo.save().then((result) => {
                return true
            }).catch((error) => {
                return false
            })
        }
    }).catch(error =>{
        console.log('error',error)
    })
}

module.exports = { totalCount }