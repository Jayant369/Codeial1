const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){

    let postId = (req.body.post).trim(); 

    try{
        let post = await Post.findById(postId);

        if(post){

            let comment = await Comment.create({
                content: req.body.content,
                post: postId,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            req.flash('success', 'Comment added');

            res.redirect('/');

        }
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
                
            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, {$pull : {comments: req.params.id}});

            req.flash('success', 'Comment deleted');

            return res.redirect('back');

        }
        else{
            req.flash('error', 'You cannot delete this comment');
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }

}