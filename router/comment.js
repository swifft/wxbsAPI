const express = require('express');
const router = express.Router();
const {successMsg, errorMsg} = require('../untils/returnMsg')
const comment = require('../model/comment')

router.post("/save", (req, res) => {
    const newComment = new comment({
        recordId: req.body.recordId,
        // 用户id
        wxUserId: req.body.wxUserId,
        // 评论内容
        content: req.body.content
    })

    newComment.save().then((result) => {
        res.json(successMsg(result))
    }).catch((error) => {
        res.json(errorMsg(error))
    })
})

module.exports = router;