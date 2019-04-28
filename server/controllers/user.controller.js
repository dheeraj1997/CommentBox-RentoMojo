const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','fullName']) });
        }
    );
}

module.exports.getComment = (req, res, next) =>{
    Comment.find({},(err, comments)=> {
        if(err) console.log(err);
        else{
            res.json(comments);
        }
    })
}

module.exports.comment = (req, res, next) => {
    var comm = new Comment();
    console.log(req.body);
    comm.text = req.body.text;
    comm.author = req.body.author;
    comm.save((err, doc) => {
        if (!err)
        res.send(doc);
    else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email address found.']);
            else
                return next(err);
        }

    });
}

module.exports.upvoteComment = (req, res, next) => {
    var id = req.params.comment_id;
    var user_id = req.body.id;
    Comment.findOne({_id:id}).then(function (doc){
        // console.log("results are ",doc);
        console.log("upvote api called ",doc);
        if(!doc.upvote){
            doc.upvote = [user_id];
            console.log(doc.upvote);
            // return doc.upvote;
        }
        else if(doc.upvote.includes(user_id)){
            console.log("upvotes contain already api",doc.upvote);
            // doc.upvote.push(user_id);
        }
        else{
            doc.upvote.push(user_id);
        }

        var newUpvote={upvote:doc.upvote};
        Comment.findByIdAndUpdate(req.params.comment_id, newUpvote, {new: true},function(err,updatedComment){
            if(err){
                res.redirect("back");
            } else{
                res.status(200).json({staus: true});
            }
        });
    })

}

module.exports.downvoteComment = (req, res, next) => {
    var id = req.params.comment_id;
    var user_id = req.body.id;
    Comment.findOne({_id:id}).then(function (doc){
        console.log("downvote api called ",doc);
        if(!doc.downvote){
            doc.downvote = [user_id];
            console.log(doc.downvote);
            // return doc.downvote;
        }
        else if(doc.downvote.includes(user_id)){
            console.log("downvotes contain already api",doc.downvote);
            // doc.downvote.push(user_id);
        }
        else{
            doc.downvote.push(user_id);
        }

        var newDownvote={downvote:doc.downvote};
        Comment.findByIdAndUpdate(req.params.comment_id, newDownvote, {new: true},function(err,updatedComment){
            if(err){
                res.redirect("back");
            } else{
                res.status(200).json({staus: true});
            }
        });
    })

}


