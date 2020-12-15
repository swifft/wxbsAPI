function successMsg(resData, configs) {
    let resMsg, resCode;
    if (configs) {
        resMsg = configs.msg
        resCode = configs.code
    }
    return {
        msg: resMsg ? resMsg : '处理成功',
        code: resCode ? resCode : 200,
        data: resData ? resData : null
    }
}

function errorMsg(resData, configs) {
    let resMsg, resCode;
    if (configs) {
        resMsg = configs.msg
        resCode = configs.code
    }
    return {
        msg: resMsg ? resMsg : '处理失败',
        code: resCode ? resCode : 400,
        data: resData ? resData : null
    }
}

module.exports = { successMsg, errorMsg }