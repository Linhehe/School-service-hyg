/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

// 课程表

var SubjectSchema = new mongoose.Schema({
    //
    SubjectName: String,
    Teacher:{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    Class:{type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    SubjectUnit: [{type: mongoose.Schema.Types.ObjectId, ref: 'SubjectUnit'}] // 上课单元
});

mongoose.model('Subject', SubjectSchema);