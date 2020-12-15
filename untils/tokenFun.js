const jwt = require('jsonwebtoken');
const baseConfig = require('../config/base');

//生成token
const setToken = function (userId) {
    return new Promise((resolve, reject) => {
        const token = 'Bearer ' + jwt.sign({ _id: userId }, baseConfig.tokenScrect, { expiresIn: 60 * 60 * 24 });
        resolve(token)
    })
}

//验证token
const getToken = function (token) {
    return new Promise((resolve, reject) => {
        const info = jwt.verify(token.split(" ")[1], baseConfig.tokenScrect);
        resolve(info);
    })
}

module.exports = { setToken, getToken }