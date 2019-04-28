const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);

// comments routes
router.post('/comment', ctrlUser.comment);
router.get('/comment', ctrlUser.getComment);
router.put('/upvote/:comment_id', ctrlUser.upvoteComment);
router.put('/downvote/:comment_id', ctrlUser.downvoteComment);


module.exports = router;



