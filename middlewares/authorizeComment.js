const Comment = require('../models/comment')

module.exports = function(req, res, next) {
    let id = req.params.id
    let commentId = req.params.commentId;

    if(req.user.role === 'admin') {
        next()
    }
    else {
        Comment.findOne({_id: commentId})
            .then(found => {
                if(found) {
                    if(found.author._id.toString() === req.user._id.toString) {
                        next()
                    }
                    else {
                        res.status(403).json('Forbidden')
                    }
                }
                else {
                    res.status(404).json('Invalid comment ID')
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(`Error during authorization. Please try again.`)
            })
    }
}