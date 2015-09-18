/**
 * Created by ff on 15/9/6.
 */
var mongoose = require('mongoose');

var ExcelSchema = new mongoose.Schema({
    ClassName: String,
    Number: String
});

mongoose.model('Excel', ExcelSchema);