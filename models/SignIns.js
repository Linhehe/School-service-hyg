/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

// 签到表

var SignInSchema = new mongoose.Schema({
    //
    StudentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    ClassId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    TeacherName: String,
    SubjectName: String,
    BeginSubjectDate: Date, // 起始时间
    EndSubjectDate: Date, // 结束时间
    AddressName: String, // 教学楼
    ClassRoomName: String, // 教室名

    SignInDate: Date, // 签到时间
    SignInAddress: {lat: Number,lng: Number}, // 签到的位置
    IsSignIn: Number, // 是否签到 （0为否，1为是）
    IsVacation: Number, // 是否请假 （0为否，1为是）

    IsTransferClass: Number, // 是否调课（0为否，1为新数据、可用，-1则本签到数据为旧数据、不可用）

    FirstSignInTime: Date, // 上课前的签到时间
    SecondSignInTime: Date, // 下课前的签到时间

    FirstSignInState: Number, // 上课前的签到状态；0：未签到；1：签到成功；-1：无效签到；2：迟到
    SecondSignInState: Number, // 下课前的签退状态；0：未签退；1：签退成功；-1：无效签退；2：迟到

    Ctnot: { type: Number, default: 0 } // 迟到：-1；旷课：旷课节数；请假：-2；默认状态为：0；
});

mongoose.model('SignIn', SignInSchema);