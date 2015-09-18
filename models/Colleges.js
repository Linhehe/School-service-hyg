/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

var CollegeSchema = new mongoose.Schema({
    //
    CollegeName: String,//学院的名称
    Professions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Profession'}]//学院嵌套专业
});

mongoose.model('College', CollegeSchema);