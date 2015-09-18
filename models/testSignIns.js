/**
 * Created by ff on 15/9/18.
 */
    var mongoose = require('mongoose');
//var SignInSchema = new mongoose.Schema({
//    //
//    Student:{type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
//    Subject:{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'},
//    Date:Date, // 签到时间
//    Address:{lat:Number,lng:Number}, // 签到的位置
//    AddressName: String // 教学楼
//});

var testSignInSchema = new mongoose.Schema({
    //
    StudentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student'},
    ClassId: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    TeacherName: String,
    SubjectName: String,
    BeginSubjectDate: Date, // 起始时间
    EndSubjectDate: Date, // 结束时间
    AddressName: String, // 教学楼

    SignInDate: Date, // 签到时间
    SignInAddress: {lat: Number,lng: Number}, // 签到的位置
    IsSignIn: Number, // 是否签到 （0为否，1为是）
    IsVacation: Number // 是否请假 （0为否，1为是）
});

mongoose.model('testSignIn', testSignInSchema);