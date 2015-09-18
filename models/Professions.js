/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

var ProfessionSchema = new mongoose.Schema({
    //
    ProfessionName: String,//专业名称
    Classes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]//专业嵌套班级
});

mongoose.model('Profession', ProfessionSchema);