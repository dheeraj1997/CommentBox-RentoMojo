const mongoose=require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    author:Object,
    upvote:[String],
    downvote:[String]
});



mongoose.model('Comment', commentSchema);
