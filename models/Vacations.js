/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

// 请假表

var VacationSchema = new mongoose.Schema({
    //
    Student: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    BeginDate: Date, // 请假的起始日期
    EndDate: Date, // 请假的结束日期
    Reason: String,
    VacationTime: Date,
    AgreeTeacher:{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    Status: { type: Number, default: -1 }, // 审批状态(0为不批准,1为批准,-1为未审核)
    AgreeTime: Date
});

mongoose.model('Vacation', VacationSchema);