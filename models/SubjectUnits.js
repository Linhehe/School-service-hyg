/**
 * Created by linhehe on 15/8/1.
 */
var mongoose = require('mongoose');

// 上课单元(上课时间+上课地点)

var SubjectUnitSchema = new mongoose.Schema({
    BeginSubjectDate:Date, // 例：2015-8-1 8:10
    EndSubjectDate:Date, // 例：2015-8-1 9:50
    Address:{type: mongoose.Schema.Types.ObjectId, ref: 'Address'}
});

mongoose.model('SubjectUnit', SubjectUnitSchema);