/**
 * Created by linhehe on 15/8/7.
 */
var mongoose = require('mongoose');

var ActivitySignInSchema = new mongoose.Schema({
    //
    Student: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
    Date: Date, // 签到时间
    Address: {lat:Number,lng:Number} // 签到的位置
});

mongoose.model('ActivitySignIn', ActivitySignInSchema);