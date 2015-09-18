/**
 * Created by linhehe on 15/8/7.
 */
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    //
    Title: String,
    Content: String,
    MessageDate: Date, // 信息发送的时间
    Teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    College: {type: mongoose.Schema.Types.ObjectId, ref: 'College'}, // 信息接受的学院
    Profession: {type: mongoose.Schema.Types.ObjectId, ref: 'Profession'}, // 信息接受的专业
    Class: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, // 信息接受的班级
    ActivityDate: Date, // 活动时间(选填)
    Address: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'} // 活动地点(选填)
});

mongoose.model('Message', MessageSchema);