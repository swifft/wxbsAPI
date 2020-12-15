const bcrypt = require('bcryptjs')

//加密
exports.encryption = (e) => {
    //生成随机的salt
    let salt = bcrypt.genSaltSync(10);
    // 生成哈希密码
    let hash = bcrypt.hashSync(e, salt);

    return hash;
}

// 解密
exports.verification = (e, hash) => {
    let verif = bcrypt.compareSync(e, hash);

    return verif;
}