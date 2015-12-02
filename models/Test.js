/**
 * Created by linhehe on 15/12/2.
 */
var mongoose = require('mongoose');

var TestSchema = mongoose.Schema(
    {
        test: String
    });

mongoose.model('Test', TestSchema);