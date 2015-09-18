/**
 * Created by linhehe on 15/8/1.
 */
var mongoose = require('mongoose');

// 调课表

var TransferClassSchema = new mongoose.Schema({
    //
    ApplyTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}, // 申请调课的老师
    ApplyTime: Date, // 申请时间
    ApplyReason: String, // 申请理由
    Classes: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, // 被调课的班级
    Status: { type: Number, default: -1 }, // 审批状态(0为不批准,1为批准,-1为未审核)

    OldBeginSubjectDate: Date, // 原来的上课起始时间
    OldEndSubjectDate: Date, // 原来的上课结束时间
    OldAddress: String, // 原来的上课地点

    NewBeginSubjectDate: Date, // 新的上课起始时间
    NewEndSubjectDate: Date, // 新的上课结束时间
    NewAddress: String, // 新的上课地点

    TeacherName: String,
    SubjectName: String,

    NewClassRoom: String,
    OldClassRoom: String,
    ClassName: String,
    TeacherName: String
    //ApplyTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}, // 申请调课的老师
    //ApplyTime: Date, // 申请时间
    //ApplyReason: String, // 申请理由
    //AgreeTeacher: {type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}, // 审批的老师
    //OriginalUnit: [{type: mongoose.Schema.Types.ObjectId, ref: 'SubjectUnit'}], // 原来的上课单元
    //NewUnit: [{type: mongoose.Schema.Types.ObjectId, ref: 'SubjectUnit'}], // 调课后的上课单元
    //Classes: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}, // 被调课的班级
    //Status: { type: Number, default: -1 }, // 审批状态(0为不批准,1为批准,-1为未审核)
    //
    //OriginalClassRoom: String, // 调课前-教室
    //NewClassRoom: String, // 调课后-教室
    //OriginalAddressName: String, // 调课前-教学楼
    //NewAddressName: String, // 调课后-教学楼
    //
    //OriginalDate: String, // 调课前-日期
    //OriginalStart: Array, // 调课前-起始时间
    //OriginalEnd: Array, // 调课前-结束时间
    //NewDate: String, // 调课后-日期
    //NewStart: Array, // 调课后-起始时间
    //NewEnd: Array, // 调课后-结束时间
    //
    //OriginalSession: String, // 调课前-节次
    //NewSession: String, // 调课后-节次
    //
    //ClassName: String,
    //ApplyTeacherName: String
});

mongoose.model('TransferClass', TransferClassSchema);