/**
 * Created by linhehe on 15/7/31.
 */
var mongoose = require('mongoose');

var SchoolSchema = new mongoose.Schema({
    //
    Name: String,
    Sex: String,
    Purview: Number // 权限
});

mongoose.model('School', SchoolSchema);