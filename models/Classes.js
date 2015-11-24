var mongoose = require('mongoose');

var ClassSchema = mongoose.Schema(
    {
        ClassName:String,// 班级的名字
        Some:String,//测试用的
        Students: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],//班级嵌套学生
        ssid: String,
        bssid: String,
        frequency: Number
    });

mongoose.model('Class', ClassSchema);
