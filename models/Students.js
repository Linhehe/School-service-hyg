/**
 * Created by linhehe on 15/7/30.
 */
var mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema({
    //
    Purview: Number, // 权限
    StudentName: String,   //名字
    Sex: String,    //性别
    Photo: String,  //头像
    Class: String,  //班级
    Number: String, //学号
    Phone:String,   //手机号码
    QQ:String,      //QQ
    Dorm: String,   //宿舍
    ID_card:String,  //身份证号
    Native:String,  //籍贯
    Password:String,  //密码

    IsSignIn: { type: Number, default: 0 },

    Classes:{type: mongoose.Schema.Types.ObjectId, ref: 'Class'},//嵌套班级
    Professions: {type: mongoose.Schema.Types.ObjectId, ref: 'Profession'},//嵌套专业
    Colleges: {type: mongoose.Schema.Types.ObjectId, ref: 'College'},//嵌套学院
    Sigins: [{type: mongoose.Schema.Types.ObjectId, ref: 'SignIn'}],

    DeviceId: String,
    WiFiSSID:String
});

mongoose.model('Student', StudentSchema);

/*
 * 关于权限：
 * 1. 学校领导
 * 2. 辅导员
 * 3. 班主任
 * 4. 纪委
 * 5. 普通学生
 */