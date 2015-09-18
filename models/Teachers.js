/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

var TeacherSchema = new mongoose.Schema({
    //
    Purview: Number, // 权限
    Name: String,
    Sex: String,
    Number:String, // 工号
    Phone:String,
    Password:String,
    Photo: String,  //头像
    QQ:String,      //QQ
    Email:String,

    Classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]
});

mongoose.model('Teacher', TeacherSchema);

/*
 * 关于权限：
 * 1. 学校领导
 * 2. 辅导员
 * 3. 班主任
 * 4. 纪委
 * 5. 普通学生
 */


