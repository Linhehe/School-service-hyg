var express = require('express');

var router = express.Router();

var xlsx = require('node-xlsx');

var JPush = require("jpush-sdk/lib/JPush/JPush.js");
var client = JPush.buildClient('9a560a04b31b41c643b8445f', 'b1740488c70f66f5e3c70049');

//声明数据库
var mongoose = require('mongoose');

//声明数据库链接
mongoose.connect('mongodb://huyugui.eicp.net:27017/school', function(err){
  console.log(err);
});

//声明调用的模型
require('../models/Students');
require('../models/Teachers');
require('../models/Classes');
require('../models/Professions');
require('../models/Colleges');
require('../models/Schools');
require('../models/Addresses');


require('../models/SubjectUnits');
require('../models/Subjects');
require('../models/SignIns');
require('../models/Vacations');
require('../models/TransferClasses');
require('../models/Messages');
require('../models/Excels');


require('../models/testSignIns');

//在数据库中开辟一块区域用于存储模型Myclass的值
var Student = mongoose.model('Student');
var Class = mongoose.model('Class');
var Teacher = mongoose.model('Teacher');
var Address = mongoose.model('Address');


var SubjectUnit = mongoose.model('SubjectUnit');
var Subject = mongoose.model('Subject');
var SignIn = mongoose.model('SignIn');
var Vacation = mongoose.model('Vacation');
var TransferClass = mongoose.model('TransferClass');
var Message = mongoose.model('Message');
var Profession = mongoose.model('Profession');
var College = mongoose.model('College');
var School = mongoose.model('School');
var Excel = mongoose.model('Excel');

var testSignIn = mongoose.model('testSignIn');

var obj = xlsx.parse('public/files/kcb.xls');

//var i = 0;
//while(i<obj.length){
//  console.log('name = ' + obj[i].name + '; i = '+ i + 'data = ' + obj[i].data[0]);
//  var excel = new Excel({ClassName: obj[i].name, Number: i});
//  excel.save();
//  i++;
//}

//AddressName: String,
//    Address: {lat: Number,lng: Number},
//Scope: Number // 范围

//var add1 = new Address({
//  AddressName:'S3',
//  Address:{lat:113.36099,lng:22.132202},
//  Scope:0.0000000754
//})
//add1.save();

var AV = require('avoscloud-sdk').AV;
AV.initialize("lkpg8p3k1wteb6uiqc398g9uk7yoxkk6vv0li0dw1aivj70j",
    "6vv9rhjr0hsep9gj5lb57gzcext5kehmz230k4i3vyy66ajv");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 短信验证(发送)
router.get('/code', function(req,res,next){
  console.log('phone:'+req.query.Phone);

  AV.Cloud.requestSmsCode({
    mobilePhoneNumber: req.query.Phone,
    name: '短信验证',
    op: '手机验证',
    ttl: 5
  }).then(function(){
    //发送成功
    console.log('success');
    res.send('success');
  }, function(err){
    //发送失败
    console.log('error');
    res.send('error');
  });
});

//验证验证码的正确
router.post('/codecheck',function(req,res,next){
  console.log(req.body.code);
  AV.Cloud.verifySmsCode(req.body.code, req.body.Phone).then(function(){
    //验证成功
    console.log('验证成功');
    res.send('success');
  }, function(err){
    //验证失败
    console.log('验证失败');
    res.send('error');
  });
});








//用户注册第一步、判断手机账号
router.get('/check_phone',function(req,res,next){
  Student.findOne({Phone:req.query.Phone},function(err,doc){
    if(err){next(err)}
    else{
      res.json(doc);
    }
  })
});
//用户注册第二步、保存用户信息
router.post('/register',function(req,res,next){
  Student.findOneAndUpdate({ID_card:req.body.ID_card},{Password:req.body.Password,Phone:req.body.Phone},function(err,doc){
    if(err){next(err)}
    else{
      res.json(doc);
    }
  })
});

//忘记密码第一步、匹配信息
router.get('/check_phone_number',function(req,res,next){
  Student.findOne({Phone:req.query.Phone,Number:req.query.Number},function(err,doc){
    if(err){next(err)}
    else{
      res.json(doc);
    }
  })
});
//忘记密码第二步、修改密码并保存
router.post('/save_password',function(req,res,next){
  Student.findOneAndUpdate({Phone:req.body.Phone,Number:req.body.Number},{Password:req.body.Password},function(err,doc){
    if(err){next(err)}
    else{
      res.json(doc);
    }
  })
});


//用户登陆
router.get('/login',function(req,res,next){
  console.log(req.query);
  if(req.query.type == '学生'){
    Student.findOne({Number:req.query.Number,Password:req.query.Password},function(err,doc){
      if(err){next(err)}
      else{
        if(doc){
          res.json(doc);
        } else{
          res.send('请输入正确的信息');
        }
      }
    });
  }
  else{
    Teacher.findOne({Number:req.query.Number,Password:req.query.Password},function(err,doc){

      if(err){next(err)}
      else{
        if(doc){
          res.json(doc);
          console.log(doc);
        }
        else{
          res.send('请输入正确的信息');
        }
      }
    })
  }
});

//学生端的数据
//学生端、获取我的班级信息
router.get('/myclass',function(req,res,next){
  Class.findOne({_id:req.query.Classes})
      .populate('Students')
      .exec(function(err,doc){
        if(err){next(err);}
        else{
          console.log(doc.Students.length)
          for(i=0;i<doc.Students.length;i++) {
            doc.Students[i].Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Students[i].Photo;
          }
          res.json(doc.Students);
        }
      })
});

//学生端、获取我的班级成员的详细信息
router.get('/myclass_infor',function(req,res,next){
  Student.findOne({_id:req.query.id},function(err,doc){
    if(err){next(err)}
    else{
      doc.Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Photo
      res.json(doc)
    }
  })
});

//学生端、获取个人信息
router.get('/student_person',function(req,res,next){
  Student.findOne({Number:req.query.Number},function(err,doc){
    if(err!=null){next(err);}
    else{
      console.log(doc);
      doc.Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Photo;
      res.json(doc)
    }
  })
});

//学生端、保存个人修改信息
router.post('/change_informations',function(req,res,next){
  if(req.body.tag == 'QQ'){
    Student.findOneAndUpdate({Number:req.body.Number }, {QQ:req.body.Infors}, function (err, doc) {
      if (err != null) {
        next(err);
      }
      else {
        res.json('QQ');
      }
    })
  }
  else if(req.body.tag == '籍贯'){
    Student.findOneAndUpdate({Number:req.body.Number}, {Native: req.body.Infors}, function (err, doc) {
      if (err != null) {
        next(err);
      }
      else {
        res.json('籍贯')
      }
    })
  }
});


//学生端、保存手机号
router.post('/stu_change_phone',function(req,res,next){
  Teacher.findOne({Phone:req.body.Phone},function(err,doc){
    if(err){next(err)}
    else{
      if(doc == null){
        Student.findOne({Phone:req.body.Phone},function(err,docs){
          if(err){next(err)}
          else{
            if(docs == null){
              Student.findOneAndUpdate({Number:req.body.Number}, {Phone: req.body.Phone}, function (err, doc1) {
                if (err != null) {
                  next(err);
                }
                else {
                  res.json(doc1);
                  console.log('修改的手机号'+doc1.Phone);
                }
              })
            }
            else{
              docs = null;
              res.json(docs);
            }
          }
        })
      }
      else{
        doc = null;
        res.json(doc);
      }
    }
  });
});
//学生端、修改密码、确定修改密码
router.post('/stu_change_password',function(req,res,next){
  Student.findOneAndUpdate({Number:req.body.Number,Password:req.body.Old_password},{Password:req.body.Sure_password},function(err,doc){
        if(err){next(err)}
        else{
          res.json(doc);
        }
      }
  )
});

//学生端、保存图片地址并将图片名称写入数据库
router.post('/stu_files', function(req,res,next){
  Student.findOneAndUpdate({Number:req.body.photo_name},{Photo:req.files.file.name},function(err,doc){
    if (err != null) {
      next(err);
    }
    else {
      res.json(doc);
    }
  })
});

//学生端、我的老师
router.get('/MyTeachers', function (req, res, next) {
  console.log(req.query.classes);
  var aa = req.query.classes;
  var array = [];
  Teacher.find({}, function (err, doc) {
    if (err){next(err);}
    else {
      for(i=0;i<doc.length;i++){
        for(j=0;j<doc[i].Classes.length;j++){
          console.log(doc[i].Classes[j]);
          if(doc[i].Classes[j] == aa){
            array.push(doc[i]);
          }
          else{}
        }
      }
      console.log(array.length);
      res.json(array);
    }
  })
})
//学生个人信息注销清空设备
router.post('/removeDeviceId', function(req,res,next){
  //
  Student.findOneAndUpdate({_id: req.body._id}, {DeviceId: ""}, function(err,doc){
    if(err){
      next(err);
    } else{
      console.log(doc);
    }
  })
});

//SubjectUnit.find({_id:"55e44495e6a6aba20847f2d6"}, function(err,doc){
//  console.log(doc);
//});
//SubjectUnit.find({Address:"55c9eb49173e966202314d1d"}, function(err,doc){
//  console.log(doc);
//  var date = new Date("2015-9-8 12:25:00");
//  date.setHours('14')
//  //if(doc[1].BeginSubjectDate<date && doc[1].EndSubjectDate>date || true ){
//  //  console.log(doc[1].BeginSubjectDate.toLocaleString());
//  //  console.log(date);
//  //}
//  //var date = new Date();
//  //for(var i=0;i<doc.length;i++){
//  //  //console.log(doc[i].BeginSubjectDate);
//  //  if(doc[i].BeginSubjectDate<date && doc[i].EndSubjectDate>date){
//  //    console.error(doc[i]);
//  //  }
//  //}
//});



//学生端、获取班级课程名称
router.get('/getSubject',function(req,res,next){
  var date = Date.parse(req.query.date);
  var newDate = new Date(date);

  SignIn.findOne({StudentId: req.query.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}}, function (err, doc) {
    if(err){next(err)}
    else{
      if(doc){
        res.json(doc.SubjectName);
      }
      else{
        doc = null;
        res.json(doc);
      }
    }
  })
});

//学生端、班委、班级成员签到列表
router.get('/getStudents', function(req,res,next){
  //
  Student.find({Classes: req.query.classes}, function(err,students){
    if(err){
      next(err);
    } else{
      res.json(students);
    }
  })
});


//router.get('/get_wifi',function(req,res,next){
//  console.log(req.query.StudentId);
//  Student.findOne({_id: req.query.StudentId},function(err,doc){
//    if(doc.IsSignIn == '1'){
//      res.send('1');
//      console.log('已经签到了')
//    }
//    else{
//      console.log('未签到')
//      res.send('0');
//    }
//  })
//})
//安卓、普通学生获取班委wifi热点的SSID
router.get('/get_wifi', function(req,res,next){
  var check = '0';
  console.log(req.query.Classes);
  Class.findOne({_id:req.query.Classes})
      .populate('Students')
      .exec(function(err,doc){
        if(err){next(err);}
        else {
          console.log(doc.Students.length);
          for (i=0;i<doc.Students.length; i++) {
            if(doc.Students[i].Purview == '4' && doc.Students[i].IsSignIn == '1'){
              console.log(doc.Students[i].WiFiSSID);
              check = '1';
              break;
            }
            else{
              check = '0';
            }
          }
          if(check == '1'){
            res.json(doc.Students[i].WiFiSSID)
          }
          else{
            res.send('没有')
          }
        }
      })
})


//安卓、普通学生检查自己的签到状态
//router.get('/check_stu',function(req,res,next){
//  console.log(req.query.StudentId);
//  Student.findOne({_id: req.query.StudentId},function(err,doc){
//    if(doc.IsSignIn == '1'){
//      res.send('1');
//      console.log('已经签到了')
//    }
//    else{
//      console.log('未签到')
//      res.send('0');
//    }
//  })
//})

//学生端，班委帮忙签到确定
router.post('/help_sign',function(req,res,next){
  var date = Date.parse(req.body.date);
  var newDate = new Date(date);

  SignIn.findOne({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}}, function (err, signs) {
    if (err) {
      next(err);
    } else {
      if (signs) {
          Student.findOneAndUpdate({_id: req.body.StudentId}, {IsSignIn: 1}, function (err, docs) {
            if (err) {
              next(err)
            }
            else {
              SignIn.findOneAndUpdate({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}},{IsSignIn: 1, SignInDate: newDate}, function(err,doc){
                console.log('签到成功');
                res.json(docs);
              })
            }
          })
      } else {
        res.send('现在不需要签到');
      }
    }
  });
})

//安卓、普通学生检查纪委是否签到
router.get('/check_Member',function(req,res,next){
  console.log(req.query.Classes);
  Class.findOne({_id:req.query.Classes})
      .populate('Students')
      .exec(function(err,doc){
        if(err){next(err);}
        else {
          for (i = 0; i < doc.Students.length; i++) {
            if(doc.Students[i].Purview == '4' && doc.Students[i].IsSignIn == '1'){
              var menber = '1'
            }
          }
          if(menber == '1'){
            res.json(doc);
            console.log('有的');
          }
          else{
            doc = null;
            res.json(doc);
          }
        }
      })
})

//安卓，纪委开启热点时检查自己是否签到
router.post('/check_sigin',function(req,res,next){
  Student.findOne({_id:req.body.StudentId},function(err,doc){
    if(doc.IsSignIn == '1'){
      res.send('1');
    }
    else{
      res.send('0');
    }
  })
})

//安卓、纪委开启热点修改SSID
router.post('/change_wifi',function(req,res,next){
  Student.findOneAndUpdate({_id:req.body.StudentId},{WiFiSSID:req.body.WiFiSSID},function(err,doc){
    if(err){next(err)}
    else{
      res.json(doc);
    }
  })
})



//安卓、普通学生、班委签到
router.post('/test', function (req,res,next){
  //
  //console.log(req.body);
  var date = Date.parse(req.body.date);
  var newDate = new Date(date);
  //console.log(typeof newDate);
  //console.log(newDate);
  //
  if(req.body.SignInId){
    // Update
    SignIn.findOneAndUpdate({_id: req.body.SignInId, IsSignIn: 0}, {IsSignIn: 1, SignInDate: newDate}, function(err,doc){
      //
      if(err){
        next(err);
      } else{
        Student.findOneAndUpdate({_id:req.body.StudentId},{IsSignIn:1},function(err,docs){
          if(err){next(err)}
          else{
            console.log('签到成功');
            res.json(doc);
          }
        })
      }
    })
  } else{
    SignIn.findOne({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}}, function(err,signs){
      //
      if(err){
        next(err);
      } else{
        console.log(signs);
        if(signs){
          //
          if(signs.IsSignIn == 0){
            //
            res.json({SubjectName: signs.SubjectName, SignInId: signs._id});
          } else{
            //
            res.send('你已经签到了');
          }
        } else{
          res.send('现在不需要签到');
        }
      }
    });
  }
});


//ios、学生签到获取教学区
//学生端、签到定位
router.get('/getpoint',function(req,res,next){
  var date = Date.parse(req.query.date);
  console.log(date);
  console.log(typeof date);
  date = new Date(date);
  console.log(date);
  console.log(typeof date);
  if(req.query.tag == "ClassRoom"){
    SignIn.findOne({StudentId: req.query.StudentId, BeginSubjectDate: {$lte: date}, EndSubjectDate: {$gte: date}}, function(err, signs){
      if(err){
        next(err);
      } else{
        if(signs){
          Address.findOne({AddressName: signs.AddressName, ClassRoomName: signs.ClassRoomName}, function(err, address){
            if(err){
              next(err);
            } else{
              if(address){
                res.json(address);
              }
            }
          });
        } else{
          res.send('没课');
        }
      }
    });
  } else{
    SignIn.findOne({StudentId: req.query.StudentId, BeginSubjectDate: {$lte: date}, EndSubjectDate: {$gte: date}}, function(err, signs){
      if(err){
        next(err);
      } else{
        if(signs){
          Address.findOne({AddressName: signs.AddressName}, function(err, address){
            if(err){
              next(err);
            } else{
              if(address){
                res.json(address);
              }
            }
          });
        } else{
          res.send('没课');
        }
      }
    });
  }
  //var MyAddress = JSON.parse(req.query.MyAddress);
  //console.log(MyAddress);
  //Address.find({},function(err,doc){
  //  if(err){next(err)}
  //  else{
  //    console.log(doc);
  //    for(i=0;i<doc.length;i++){
  //      var x = (MyAddress.lng-doc[i].Address.lng);
  //      console.log('x:'+x);
  //      var y = (MyAddress.lat-doc[i].Address.lat);
  //      console.log('y:'+y);
  //      var r =x*x+y*y;
  //      console.log('r:'+r);
  //      if(r <= doc[i].Scope){
  //        res.json('1');
  //        console.log('对的')
  //      }
  //      else{
  //        res.json('0');
  //        console.log('错的');
  //      }
  //    }
  //  }
  //});
});

//ios学生确定签到
router.post('/ios_test', function (req, res, next) {
  var date = Date.parse(req.body.date);
  var newDate = new Date(date);

  SignIn.findOne({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}}, function (err, signs) {
    if (err) {
      next(err);
    } else {
      if (signs) {
        if (signs.IsSignIn == 0) {
          Student.findOneAndUpdate({_id: req.body.StudentId}, {IsSignIn: 1}, function (err, docs) {
            if (err) {
              next(err)
            }
            else {
              SignIn.findOneAndUpdate({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: newDate}, EndSubjectDate: {$gte: newDate}},{IsSignIn: 1, SignInDate: newDate}, function(err,doc){
                console.log('签到成功');
                res.json(doc);
              })
            }
          })
        }
        else {
          //
          res.send('你已经签到了');
        }
      } else {
        res.send('现在不需要签到');
      }
    }
  });
});

//var date = new Date();
//SignIn.findOne({StudentId: '55ed4a8a7564496706c98204', BeginSubjectDate: {$lte: date}, EndSubjectDate: {$gte: date}}, function(err,signs){
//  console.log(signs);
//});




























//教师端的数据

//教师端、获取个人信息
router.get('/teacher_person',function(req,res,next){
  Teacher.findOne({Number:req.query.Number},function(err,doc){
    if(err!=null){next(err);}
    else{
      console.log(doc);
      doc.Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Photo
      res.json(doc)
    }
  })
});

//教师端、保存个人修改信息
router.post('/tea_change_informations',function(req,res,next){
  if(req.body.tag == 'QQ'){
    Teacher.findOneAndUpdate({Number:req.body.Number }, {QQ:req.body.Infors}, function (err, doc) {
      if (err != null) {
        next(err);
      }
      else {
        res.json('QQ');
      }
    })
  }
  else if(req.body.tag == '邮箱'){
    Teacher.findOneAndUpdate({Number:req.body.Number}, {Email: req.body.Infors}, function (err, doc) {
      if (err != null) {
        next(err);
      }
      else {
        res.json('邮箱')
      }
    })
  }
});


//教师端、保存手机号
router.post('/tea_change_phone',function(req,res,next){
  Student.findOne({Phone:req.body.Phone},function(err,doc){
    if(err){next(err)}
    else{
      if(doc == null){
        Teacher.findOne({Phone:req.body.Phone},function(err,docs){
          if(err){next(err)}
          else{
            if(docs == null){
              Teacher.findOneAndUpdate({Number:req.body.Number}, {Phone: req.body.Phone}, function (err, doc1) {
                if (err != null) {
                  next(err);
                }
                else {
                  res.json(doc1);
                  console.log('修改的手机号'+doc1.Phone);
                }
              })
            }
            else{
              docs = null;
              res.json(docs);
            }
          }
        })
      }
      else{
        doc = null;
        res.json(doc);
      }
    }
  });
});
//教师端、修改密码、确定修改密码
router.post('/tea_change_password',function(req,res,next){
  Teacher.findOneAndUpdate({Number:req.body.Number,Password:req.body.Old_password},{Password:req.body.Sure_password},function(err,doc){
        if(err){next(err)}
        else{
          res.json(doc);
        }
      }
  )
});

//教师端、保存图片地址并将图片名称写入数据库
router.post('/tea_files', function(req,res,next){
  Teacher.findOneAndUpdate({Number:req.body.photo_name},{Photo:req.files.file.name},function(err,doc){
    if (err != null) {
      next(err);
    }
    else {
      res.json(doc);
    }
  })
});


////学生端、获取我的班级信息
//router.get('/myclass',function(req,res,next){
//  Class.findOne({_id:req.query.Classes})
//      .populate('Students')
//      .exec(function(err,doc){
//        if(err){next(err);}
//        else{
//          console.log(doc.Students.length)
//          for(i=0;i<doc.Students.length;i++) {
//            doc.Students[i].Photo = 'http://172.16.42.130:3000/images/'+doc.Students[i].Photo;
//          }
//          res.json(doc.Students);
//        }
//      })
//});

//老师页面的学院列表信息
router.get('/tea_college', function(req,res,next){
  College.find({},function(err,doc){
    if(err){next(err)}
    else{
      console.log(doc);
      res.json(doc);
    }
  })
});

//老师页面的专业信息
router.get('/tea_profession', function(req,res,next){
  College.findOne({_id:req.query.collegeId})
      .populate('Professions')
      .exec(function(err,doc){
        if(err){next(err);}
        else{
          res.json(doc.Professions);
          console.log(doc.Professions)
        }
      })
});

//老师页面的班级列表信息
router.get('/tea_class',function(req,res,next){
  Profession.findOne({_id:req.query.professionId})
      .populate('Classes')
      .exec(function(err,doc){
        if(err){next(err);}
        else{
          res.json(doc.Classes);

          console.log(doc.Classes);
        }
      })
});
//老师页面的班级成员列表信息
router.get('/tea_student',function(req,res,next){
    Class.findOne({_id:req.query.ClassId})
        .populate('Students')
        .exec(function (err, doc) {
            if(err){next(err)}
            else{
                for(i=0;i<doc.Students.length;i++) {
                    doc.Students[i].Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Students[i].Photo;
                }
                res.json(doc.Students);
            }
        })
});
//老师页面的班级成员的详细信息
router.get('/tea_stu_preson',function(req,res,next){
    Student.findOne({_id:req.query.StudentId},function(err,doc){
        if(err){next(err)}
        else{
          doc.Photo = 'http://huyugui.eicp.net:4343/images/'+doc.Photo
          res.json(doc)
        }
    })
});


SubjectUnit.findOne({BeginSubjectDate:{$lte: new Date()}, EndSubjectDate:{$gte: new Date()}, Address: '55ce9c7df9b2d795034628e7'}, function(err,doc){
  console.log(doc);
  //if(new Date() > doc.BeginSubjectDate){
  //  console.log('456');
  //};
});


// ******* 请假
// *学生申请*
router.post('/vacation', function(req,res,next){
  //
  console.log(req.body);
  var BeginDate = new Date(req.body.BeginDate);
  //BeginDate.setHours(24,00,00);
  var EndDate = new Date(req.body.EndDate);
  //EndDate.setHours(24,00,00);
  var vacation = new Vacation({
    Student: req.body.Student,
    BeginDate: BeginDate,
    EndDate: EndDate,
    Reason: req.body.Reason,
    VacationTime: new Date(req.body.VacationTime)
  });
  vacation.save(function(err,doc){
    if(err){
      //next(err);
      console.error(err);
    } else{
      res.json(doc);
      client.push().setPlatform('ios', 'android')
          .setAudience(JPush.tag(req.body.ClassesId+'_3'))
          .setNotification("有新的请假申请", JPush.ios("有新的请假申请", "APP提示"), JPush.android("有新的请假申请", "APP提示", 2))
          .setOptions(null, 60)
          .send(function(err, res) {
            if (err) {
              console.log(err.message);
            } else {
              console.log('Sendno: ' + res.sendno);
              console.log('Msg_id: ' + res.msg_id);
            }
          });
    }
  });
});
// *教师查看申请*
router.get('/checkVacation', function(req,res,next){
  //
  var i=0;
  var StudentName = [];
  if(req.query._id){
    //
    if(req.query.tag == 'GetClass'){
      //
      Class.findOne({_id: req.query._id}, function(err,classes){
        //
        res.json(classes);
      });
    } else{
      Vacation.find({_id: req.query._id})
          .populate("Student")
          .exec(function(err,vacations){
            //
            res.json(vacations);
          });
    }
  } else{
    Vacation.find({})
        .populate("Student")
        .exec(function(err,vacations){
          //
          console.log(vacations);
          res.json(vacations);
        });
  }
});
// *教师审批*
router.put('/verify', function(req,res,next){
  //
  Vacation.findOne({_id: req.body._id}, function(err,vacations){
    //
    if(err){
      next(err);
    } else{
      if(req.body.Status == '1'){
        SignIn.update({BeginSubjectDate:{$gte: vacations.BeginDate}, EndSubjectDate:{$lte: vacations.EndDate}, StudentId: vacations.Student}, { $set: { IsVacation: 1 , Ctnot: -2 }}, { multi: true }, function(err,signIns){
          //
          if(err){
            next(err);
          } else{
            //
            console.log(signIns);
          }
        });
      }
    }
  });
  //
  Vacation.findOneAndUpdate({
    //
    _id: req.body._id
  }, {
    //
    Status: req.body.Status
  }, function(err,doc){
    //
    if(err){
      next(err);
    } else{
      res.json(doc);
      console.log('**********')
      console.log(doc.Student)
      console.log(doc.Student.toString())
      client.push().setPlatform('ios', 'android')
          .setAudience(JPush.alias(doc.Student.toString()))
          .setNotification("您的请假审核有结果了", JPush.ios("您的请假审核有结果了", "APP提示"), JPush.android("您的请假审核有结果了", "APP提示", 2))
          .setOptions(null, 60)
          .send(function(err, res) {
            if (err) {
              console.log(err.message);
            } else {
              console.log('Sendno: ' + res.sendno);
              console.log('Msg_id: ' + res.msg_id);
            }
          });
    }
  });
});
// *学生查看申请结果*
router.get('/viewResults', function(req,res,next){
  //
  Vacation.find({Student: req.query.Student}, function(err,vacations){
    //
    if(err){
      next(err);
    } else{
      console.log(vacations);
      res.json(vacations);
    }
  });
});
// 请假 *******

// ******* 调课
// *获取教师调课可选但班级*
router.get('/getClassesName', function(req,res,next){
  Teacher.find({_id: '55ed546d5ef0f1be065579ce'})
      .populate('Classes')
      .exec(function(err,teacher){
        //
        console.log(teacher[0].Classes);
        res.json(teacher[0].Classes);
      });
});
// *申请调课*
SignIn.find({ClassId: "55ed4d83100c389106ad7874", BeginSubjectDate: {$in: [new Date('2015-9-5 8:10')]}}, function(err,doc){
  console.log(doc);
});
router.post('/applyTransferClass', function(req,res,next){
  //
  var OldBeginSubjectDate = req.body.OldBeginSubjectDate;
  var OldEndSubjectDate = req.body.OldEndSubjectDate;
  var NewBeginSubjectDate = req.body.NewBeginSubjectDate;
  var NewEndSubjectDate = req.body.NewEndSubjectDate;
  //
  for(var i=0; i<OldBeginSubjectDate.length; i++){
    //
    OldBeginSubjectDate[i] = new Date(OldBeginSubjectDate[i]);
    OldEndSubjectDate[i] = new Date(OldEndSubjectDate[i]);
  }
  console.error(req.body);
  //
  SignIn.find({ClassId: req.body.ClassId, BeginSubjectDate: {$in: OldBeginSubjectDate}, EndSubjectDate: {$in: OldEndSubjectDate}}, function(err,signIns){
    //
    if(err){
      next(err);
    } else{
      if(signIns.length != 0){
        //
        if(OldBeginSubjectDate.length == NewBeginSubjectDate.length){
          for(var i=0; i<OldBeginSubjectDate.length; i++){
            var transferClass = new TransferClass({
              ApplyTeacher: req.body.ApplyTeacher, // 申请调课的老师
              ApplyTime: req.body.ApplyTime, // 申请时间
              ApplyReason: req.body.ApplyReason, // 申请理由
              Classes: req.body.ClassId, // 被调课的班级
              ClassName: req.body.ClassName,

              OldBeginSubjectDate: OldBeginSubjectDate[i], // 原来的上课起始时间
              OldEndSubjectDate: OldEndSubjectDate[i], // 原来的上课结束时间
              OldAddress: req.body.OriginalAddressName, // 原来的上课地点
              OldClassRoom: req.body.OriginalClassRoom,

              NewBeginSubjectDate: NewBeginSubjectDate[i], // 新的上课起始时间
              NewEndSubjectDate: NewEndSubjectDate[i], // 新的上课结束时间
              NewAddress: req.body.NewAddressName, // 新的上课地点
              NewClassRoom: req.body.NewClassRoom,

              TeacherName: req.body.ApplyTeacherName,
              SubjectName: req.body.SubjectName
            });
            transferClass.save();
          }
          res.send('申请已提交');
        }
        if(OldBeginSubjectDate.length == 2 && NewBeginSubjectDate.length == 1){
          //
          for(var i=0; i<OldBeginSubjectDate.length; i++){
            var transferClass = new TransferClass({
              ApplyTeacher: req.body.ApplyTeacher, // 申请调课的老师
              ApplyTime: req.body.ApplyTime, // 申请时间
              ApplyReason: req.body.ApplyReason, // 申请理由
              Classes: req.body.ClassId, // 被调课的班级
              ClassName: req.body.ClassName,

              OldBeginSubjectDate: OldBeginSubjectDate[i], // 原来的上课起始时间
              OldEndSubjectDate: OldEndSubjectDate[i], // 原来的上课结束时间
              OldAddress: req.body.OriginalAddressName, // 原来的上课地点
              OldClassRoom: req.body.OriginalClassRoom,

              NewBeginSubjectDate: NewBeginSubjectDate[0], // 新的上课起始时间
              NewEndSubjectDate: NewEndSubjectDate[0], // 新的上课结束时间
              NewAddress: req.body.NewAddressName, // 新的上课地点
              NewClassRoom: req.body.NewClassRoom,

              TeacherName: req.body.ApplyTeacherName,
              SubjectName: req.body.SubjectName
            });
            transferClass.save();
          }
          res.send('申请已提交');
        }
        //
      } else{
        res.send('不存在该课程');
      }
    }
  });
  //
});
// *查看调课申请*
router.get('/viewTransferClass', function(req,res,next){
  //
  TransferClass.find({}, function(err,doc){
    //
    if(err){
      next(err);
    } else{
      console.log(doc);
      res.json(doc);
    }
  });
});
// *审批*
router.put('/verifyTransferClass', function(req,res,next){
  //
  console.log(req.body);
  if(req.body.Status == 0){
    //
    TransferClass.findOneAndUpdate({_id: req.body._id, Status: -1}, {Status: 0}, function(err,doc){
      //
      if(err){
        next(err);
      } else{
        console.log("doc = "+doc);
        res.json(doc);
      }
    });
  }
  else if(req.body.Status == 1){
    //
    TransferClass.findOneAndUpdate({_id: req.body._id, Status: -1}, {Status: 1}, function(err,doc){
      //
      if(err){
        next(err);
      } else{
        res.json(doc);
      }
    });
    //
    //console.log("req.body._id = "+req.body._id);
    TransferClass.findOne({_id: req.body._id}, function(err,doc) {
      //
      console.error(doc);
      Student.find({Classes: doc.Classes})
          .exec(function (err, stu) {
            //
            //console.log(stu);
            for (var i = 0, j = 0; i < stu.length; i++) {
              var signtest = new SignIn({
                StudentId: stu[i]._id,
                ClassId: doc.Classes,
                TeacherName: doc.TeacherName,
                SubjectName: doc.SubjectName,
                BeginSubjectDate: doc.NewBeginSubjectDate,
                EndSubjectDate: doc.NewEndSubjectDate,
                AddressName: doc.NewAddress,
                SignInDate: "",
                IsSignIn: 0,
                IsVacation: 0,
                IsTransferClass: 1
              });
              signtest.save();
            }
          });
      //
      //SignIn.update({ClassId: doc.ClassId, BeginSubjectDate: doc.OldBeginSubjectDate, EndSubjectDate: doc.OldEndSubjectDate}, { $set: { IsTransferClass: -1 }}, { multi: true }, function(err,doc){
      //  //
      //  if(err){
      //    next(err);
      //  } else{
      //    console.log(doc);
      //  }
      //});
    });
  }
  else{
    //
    TransferClass.findOne({_id: req.body._id}, function(err, transferclass){
      //
      if(err){
        next(err);
      } else{
        console.log(transferclass);
        res.json(transferclass);
      }
    });
  }
});
// *查看审批结果*
router.get('/viewResult', function(req,res,next){
  //
  TransferClass.find({ApplyTeacher: req.query.ApplyTeacher}, function(err,doc){
    //
    if(err){
      next(err);
    } else{
      res.json(doc);
      console.log(doc);
    }
  });
});
//router.get('/viewResult', function(req,res,next){
//  //
//  var i= 0, j=0;
//  var OriginalStart=[], OriginalEnd=[];
//  var m= 0, n=0;
//  var NewStart=[], NewEnd=[];
//  TransferClass.find({ApplyTeacher: req.query.ApplyTeacher}) //ApplyTeacher: '55c2b8dadda1612d02e4961b'
//      .populate('NewUnit')
//      .populate('OriginalUnit')
//      .exec(function(err,transferclass){
//        //
//        console.log(transferclass);
//        var OriginalDate = transferclass[0].OriginalUnit[0].BeginSubjectDate.getFullYear()+"-"+transferclass[0].OriginalUnit[0].BeginSubjectDate.getMonth()+"-"+transferclass[0].OriginalUnit[0].BeginSubjectDate.getDate();
//        var NewDate = transferclass[0].NewUnit[0].BeginSubjectDate.getFullYear()+"-"+transferclass[0].NewUnit[0].BeginSubjectDate.getMonth()+"-"+transferclass[0].NewUnit[0].BeginSubjectDate.getDate();
//        //console.log(transferclass[0].OriginalUnit[0].BeginSubjectDate.getHours()+":"+transferclass[0].OriginalUnit[0].BeginSubjectDate.getMinutes()+":00");
//        //console.log(transferclass[0].OriginalUnit[0].EndSubjectTime.getHours()+":"+transferclass[0].OriginalUnit[0].EndSubjectTime.getMinutes()+":00");
//        while(i<transferclass.length){
//          while(j<transferclass[i].OriginalUnit.length){
//            //
//            OriginalStart.push(transferclass[i].OriginalUnit[j].BeginSubjectDate.getHours()+":"+transferclass[i].OriginalUnit[j].BeginSubjectDate.getMinutes()+":00");
//            OriginalEnd.push(transferclass[i].OriginalUnit[j].EndSubjectDate.getHours()+":"+transferclass[i].OriginalUnit[j].EndSubjectDate.getMinutes()+":00");
//            j++;
//          }
//          i++;
//        }
//        //console.log(OriginalStart);
//        //console.log(OriginalEnd);
//
//        while(m<transferclass.length){
//          while(n<transferclass[m].NewUnit.length){
//            //
//            NewStart.push(transferclass[m].NewUnit[n].BeginSubjectDate.getHours()+":"+transferclass[m].NewUnit[n].BeginSubjectDate.getMinutes()+":00");
//            NewEnd.push(transferclass[m].NewUnit[n].EndSubjectDate.getHours()+":"+transferclass[m].NewUnit[n].EndSubjectDate.getMinutes()+":00");
//            n++;
//          }
//          m++;
//        }
//        //console.log(NewStart);
//        //console.log(NewEnd);
//        //console.log(transferclass[0]);
//
//        //var r=0;
//        //var result={};
//        //while(r<transferclass.length){
//        //  result = {
//        //    ApplyTeacher: '',
//        //    Classes: '',
//        //    ApplyReason: transferclass[r].ApplyReason,
//        //    //OriginalDate: OriginalDate, // 调课前-日期
//        //    //OriginalStart: OriginalStart,
//        //    //OriginalEnd: OriginalEnd,
//        //    //NewDate: NewDate, // 调课后-日期
//        //    //NewStart: NewStart,
//        //    //NewEnd: NewEnd,
//        //    OriginalAddressName: transferclass[r].OriginalAddressName,
//        //    OriginalClassRoom: transferclass[r].OriginalClassRoom,
//        //    NewAddressName: transferclass[r].NewAddressName,
//        //    NewClassRoom: transferclass[r].NewClassRoom
//        //  };
//        //}
//        //result["OriginalDate"] = OriginalDate;
//        console.log(transferclass);
//        res.json(transferclass);
//      });
//});
// 调课 *******

// ******* 教师-检查权限
router.get('/CheckPurview', function(req,res,next){
  //
  console.log(req.query.TeacherId);
  Teacher.findOne({_id: req.query.TeacherId}, function(err,teacher){
    //
    if(err){
      next(err);
    } else{
      console.log("Purview = "+teacher.Purview);
      res.json(teacher.Purview);
    }
  });
});
// 教师-检查权限 *******

// ******* 教师-信息发送
router.get('/GetInformation', function(req,res,next){
  //
  console.log(req.query);
  if(req.query.tag == 'GetCollege'){
    College.find({}, function(err,college){
      //
      res.json(college);
    });
  }
  if(req.query.tag == 'GetProfession'){
    College.findOne({CollegeName: req.query.CollegeName})
        .populate('Professions')
        .exec(function(err,profession){
          //
          //console.log(profession[0].Professions);
          res.json(profession.Professions);
        });
  }
  if(req.query.tag == 'GetClasses'){
    Profession.findOne({ProfessionName: req.query.ProfessionName})
        .populate('Classes')
        .exec(function(err,classes){
          //
          console.log(classes.Classes);
          res.json(classes.Classes);
        });
  }
});
router.post('/SendMessage', function(req,res,next){
  //
  var date = new Date();
  console.log('=================');
  console.log(req.body);
  console.log('=================');
  if(req.body.ClassId == '全院'){
    //
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.tag(req.body.CollegeId))
        .setNotification(req.body.Content, JPush.ios(req.body.Content, req.body.Title), JPush.android(req.body.Content, req.body.Title, 2))
        .setOptions(null, 60)
        .send(function(err, res) {
          if (err) {
            console.log(err.message);
          } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
          }
        });
    //
    var message = new Message({
      //
      Title: req.body.Title,
      Content: req.body.Content,
      MessageDate: date, // 信息发送的时间
      Teacher: mongoose.Types.ObjectId(req.body.Teacher),
      College: mongoose.Types.ObjectId(req.body.CollegeId)
      //ActivityDate: req.body.ActivityDate, // 活动时间(选填)
      //Address: req.body.Address // 活动地点(选填)
    });
  }
  else if(req.body.ClassId == '全专业'){
    //
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.tag(req.body.ProfessionId))
        .setNotification(req.body.Content, JPush.ios(req.body.Content, req.body.Title), JPush.android(req.body.Content, req.body.Title, 2))
        .setOptions(null, 60)
        .send(function(err, res) {
          if (err) {
            console.log(err.message);
          } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
          }
        });
    //
    var message = new Message({
      //
      Title: req.body.Title,
      Content: req.body.Content,
      MessageDate: date, // 信息发送的时间
      Teacher: mongoose.Types.ObjectId(req.body.Teacher),
      College: mongoose.Types.ObjectId(req.body.CollegeId), // 信息接受的学院
      Profession: mongoose.Types.ObjectId(req.body.ProfessionId) // 信息接受的专业
      //ActivityDate: req.body.ActivityDate, // 活动时间(选填)
      //Address: req.body.Address // 活动地点(选填)
    });
  }
  else{
    //
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.tag(req.body.ClassId))
        .setNotification(req.body.Content, JPush.ios(req.body.Content, req.body.Title), JPush.android(req.body.Content, req.body.Title, 2))
        .setOptions(null, 60)
        .send(function(err, res) {
          if (err) {
            console.log(err.message);
          } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
          }
        });
    //
    var message = new Message({
      //
      Title: req.body.Title,
      Content: req.body.Content,
      MessageDate: date, // 信息发送的时间
      Teacher: mongoose.Types.ObjectId(req.body.Teacher),
      College: mongoose.Types.ObjectId(req.body.CollegeId), // 信息接受的学院
      Profession: mongoose.Types.ObjectId(req.body.ProfessionId), // 信息接受的专业
      Class: mongoose.Types.ObjectId(req.body.ClassId) // 信息接受的班级
      //ActivityDate: req.body.ActivityDate, // 活动时间(选填)
      //Address: req.body.Address // 活动地点(选填)
    });
  }
  message.save(function(err){
    if(err){
      next(err);
    } else{
      res.send('信息发送成功');
    }
  });
});
// 教师-信息发送 *******

// ******* 学生接收信息
router.get('/GetMessage', function(req,res,next){
  //
  console.error(req.query);
  Message.find({$or:[
    {College: req.query.CollegeId, Profession: req.query.ProfessionId, Class: req.query.ClassId},
    {College: req.query.CollegeId, Profession: req.query.ProfessionId, Class: null},
    {College: req.query.CollegeId, Profession: null, Class: null}]}, function(err,messages){
    //
    console.log(messages);
    res.json(messages);
  });
});
// 学生接收信息 ******* BC09106E-C882-4982-87D9-135D8F39DE19

router.get('/getClassName', function(req,res,next){
  console.log(req.query);
  Class.findOne({_id: req.query.ClassId}, function(err,className){
    if(err){
      next(err);
    } else{
      console.log(className.ClassName);
      res.json(className.ClassName);
    }
  })
});
router.get('/gkb', function(req,res,next){
  //
  //console.error(req.query.classes);
  query = new RegExp(req.query.classes, 'i');

  Excel.findOne({ClassName: query}, function(err,doc){
    console.log(doc.Number);

    var obj = xlsx.parse('public/files/kcb.xls');
    res.json(obj[doc.Number]);
  });

});


// 定时任务
var schedule = require('node-schedule');

var rule1 = new schedule.RecurrenceRule();
var rule2 = new schedule.RecurrenceRule();
var rule3 = new schedule.RecurrenceRule();
var rule4 = new schedule.RecurrenceRule();

rule1.hour = 9;
rule1.minute = 51;
rule2.hour = 11;
rule2.minute = 51;
rule3.hour = 17;
rule3.minute = 6;
rule4.hour = 21;
rule4.minute = 41;

var j1 = schedule.scheduleJob(rule1, function(){
  Student.update({}, { $set: { IsSignIn: 0, WiFiSSID: "0" }}, { multi: true }, function(err,doc){
    //
    console.log(doc);
  });
});
var j2 = schedule.scheduleJob(rule2, function(){
  Student.update({}, { $set: { IsSignIn: 0, WiFiSSID: "0" }}, { multi: true }, function(err,doc){
    //
    console.log(doc);
  });
});
var j3 = schedule.scheduleJob(rule3, function(){
  Student.update({}, { $set: { IsSignIn: 0, WiFiSSID: "0" }}, { multi: true }, function(err,doc){
    //
    console.log(doc);
  });
});
var j4 = schedule.scheduleJob(rule4, function(){
  Student.update({}, { $set: { IsSignIn: 0, WiFiSSID: "0" }}, { multi: true }, function(err,doc){
    //
    console.log(doc);
  });
});

//console.log(obj[0].name);

//var schedule = require('node-schedule');
//var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(1, 5)];
//rule.hour = 15;
//rule.minute = 59;
//var j = schedule.scheduleJob(rule, function(){
//  Student.update({}, { $set: { IsSignIn: 0 }}, { multi: true }, function(err,doc){
//    //
//    if(err){
//      console.error(err);
//    } else{
//      console.log(new Date());
//    }
//  });
//});






router.get('/getSignIn', function(req,res,next){
  //
  var beginDay = new Date("2015-11-3");
  var now = new Date();
  SignIn.find({ClassId: req.query.ClassId, BeginSubjectDate: {$gte: beginDay}, EndSubjectDate: {$lte: new Date()}, Ctnot: {$gte: 0}})
      .populate('StudentId')
      .exec(function(err,signs){
        var array = [];
        signs.forEach(function(item, callback){
          //
          if(array.length != 0){
            array.forEach(function(arr, callback){
              //
              if(arr.StudentId.toString() == item.StudentId._id.toString()){
                //
                arr.Ctnot = parseInt(arr.Ctnot) + parseInt(item.Ctnot)
              } else{
                //
                array.push({
                  StudentId: item.StudentId._id,
                  StudentName: item.StudentId.StudentName,
                  Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
                  Ctnot: item.Ctnot,
                  SubjectName: item.SubjectName,
                  BeginSubjectDate: item.BeginSubjectDate,
                  EndSubjectDate: item.EndSubjectDate
                })
              }
            });
          } else{
            array.push({
              StudentId: item.StudentId._id,
              StudentName: item.StudentId.StudentName,
              Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
              Ctnot: item.Ctnot,
              SubjectName: item.SubjectName,
              BeginSubjectDate: item.BeginSubjectDate,
              EndSubjectDate: item.EndSubjectDate
            })
          }
        });
        res.json(array);
      });
  //SignIn.find({ClassId: req.query.ClassId, BeginSubjectDate: {$gte: beginDay}, EndSubjectDate: {$lte: new Date()}, IsVacation: 0}) //  SecondSignInState: 1, FirstSignInState: -1,
  //    .populate('StudentId')
  //    .exec(function(err,signs){
  //      var array = [];
  //      signs.forEach(function(item, callback){
  //        //
  //        if(array.length != 0){
  //          array.forEach(function(arr, callback){
  //            //
  //            if(arr.StudentId.toString() == item.StudentId._id.toString()){
  //              //
  //              arr.Ctnot = parseInt(arr.Ctnot)+parseInt(Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime))
  //            } else{
  //              //
  //              array.push({
  //                StudentId: item.StudentId._id,
  //                StudentName: item.StudentId.StudentName,
  //                Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
  //                Ctnot: Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime),
  //                SubjectName: item.SubjectName,
  //                BeginSubjectDate: item.BeginSubjectDate,
  //                EndSubjectDate: item.EndSubjectDate
  //              })
  //            }
  //          });
  //        } else{
  //          array.push({
  //            StudentId: item.StudentId._id,
  //            StudentName: item.StudentId.StudentName,
  //            Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
  //            Ctnot: Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime),
  //            SubjectName: item.SubjectName,
  //            BeginSubjectDate: item.BeginSubjectDate,
  //            EndSubjectDate: item.EndSubjectDate
  //          })
  //        }
  //      });
  //      console.log(array);
  //      res.json(array);
  //    });
});

router.get('/StudentViewCtnot', function(req,res,next){
  //
  var beginDay = new Date("2015-11-3");
  var now = new Date();

  SignIn.find({StudentId: req.query.StudentId, BeginSubjectDate: {$gte: beginDay}, EndSubjectDate: {$lte: new Date()}, Ctnot: {$gte: 0}})
      .populate('StudentId')
      .exec(function(err,signs){
        var array = [];
        signs.forEach(function(item, callback){
          //
          if(array.length != 0){
            array.forEach(function(arr, callback){
              //
              if(arr.StudentId.toString() == item.StudentId._id.toString()){
                //
                arr.Ctnot = parseInt(arr.Ctnot) + parseInt(item.Ctnot)
              } else{
                //
                array.push({
                  StudentId: item.StudentId._id,
                  StudentName: item.StudentId.StudentName,
                  Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
                  Ctnot: item.Ctnot,
                  SubjectName: item.SubjectName,
                  BeginSubjectDate: item.BeginSubjectDate,
                  EndSubjectDate: item.EndSubjectDate
                })
              }
            });
          } else{
            array.push({
              StudentId: item.StudentId._id,
              StudentName: item.StudentId.StudentName,
              Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
              Ctnot: item.Ctnot,
              SubjectName: item.SubjectName,
              BeginSubjectDate: item.BeginSubjectDate,
              EndSubjectDate: item.EndSubjectDate
            })
          }
        });
        res.json(array);
      });

  //SignIn.find({StudentId: req.query.StudentId, BeginSubjectDate: {$gte: beginDay}, EndSubjectDate: {$lte: now}, SecondSignInState: 1, FirstSignInState: -1, IsVacation: 0})
  //    .populate('StudentId')
  //    .exec(function(err,signs){
  //      var array = [];
  //      signs.forEach(function(item, callback){
  //        //
  //        if(array.length != 0){
  //          array.forEach(function(arr, callback){
  //            //
  //            if(arr.StudentId.toString() == item.StudentId._id.toString()){
  //              //
  //              arr.Ctnot = parseInt(arr.Ctnot)+parseInt(Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime))
  //            } else{
  //              //
  //              array.push({
  //                StudentId: item.StudentId._id,
  //                StudentName: item.StudentId.StudentName,
  //                Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
  //                Ctnot: Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime),
  //                SubjectName: item.SubjectName,
  //                BeginSubjectDate: item.BeginSubjectDate,
  //                EndSubjectDate: item.EndSubjectDate
  //              })
  //            }
  //          });
  //        } else{
  //          array.push({
  //            StudentId: item.StudentId._id,
  //            StudentName: item.StudentId.StudentName,
  //            Photo: 'http://huyugui.eicp.net:4343/images/'+ item.StudentId.Photo,
  //            Ctnot: Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime),
  //            SubjectName: item.SubjectName,
  //            BeginSubjectDate: item.BeginSubjectDate,
  //            EndSubjectDate: item.EndSubjectDate
  //          })
  //        }
  //      });
  //      console.log(array);
  //      res.json(array);
  //    });
});

router.get('/getSignInfor', function(req,res,next){
  SignIn.find({StudentId: req.query.StudentId, IsSignIn: 0, BeginSubjectDate:{$gte: new Date('2015-9-17')}, EndSubjectDate:{$lte: new Date()}}, function(err,signs){
    //
    console.log(signs);
    res.json(signs);
  });
});

//SignIn.update({}, { $set: { SignInDate: new Date('') }}, { multi: true }, function(err,doc){
//  //
//});

router.post('/getwifimessage', function(req,res,next){
  Class.findOne({_id: req.body.ClassId}, function(err,doc){
    if(err){
      next(err);
    } else{
      res.json(doc);
    }
  })
});

//管理后台的老师登陆
router.get('/manage_login',function(req,res,next){
  Teacher.findOne({Number:req.query.Number,Password:req.query.Password},function(err,doc){
    if(err){next(err)}
    else{
      if(doc){
        res.json(doc);
      }
      else{
        res.send('请输入正确的信息');
      }
    }
  })
});

// 签到
router.post('/SignIn', function(req,res,next){
  function CountSignIn(startTime, signinTime){
    var result = (signinTime.getHours()-startTime.getHours())*60 + (signinTime.getMinutes()-startTime.getMinutes());
    return result;
  }
  var date = Date.parse(req.body.date);
  date = new Date(date);
  SignIn.findOne({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: date}, EndSubjectDate: {$gte: date}}, function(err, signs){
    if(err){
      next(err);
    } else{
      if(signs){
        console.log(typeof signs.FirstSignInState);
        if(signs.FirstSignInState == 0){
          if(CountSignIn(signs.BeginSubjectDate, date)<=10){
            console.log('可以签到');
            signs.FirstSignInState = 1;
            signs.FirstSignInTime = date;
            signs.save();
            res.send('签到成功');
          } else if(CountSignIn(signs.BeginSubjectDate, date)>10 && CountSignIn(signs.BeginSubjectDate, date)<=25){
            console.log('迟到');
            signs.FirstSignInState = 2;
            signs.FirstSignInTime = date;
            signs.save();
            res.send('签到成功');
          } else{
            console.log('无效签到');
            signs.FirstSignInState = -1;
            signs.FirstSignInTime = date;
            signs.save();
            res.send('签到成功');
          }
        } else{
          res.send('你已经签到了');
        }
      } else{
        res.send('现在不是签到时间');
      }
    }
  });
});

// 签退
router.post('/SignOut', function(req,res,next){
  function CountSignOut(endTime, signinTime){
    var result = (endTime.getHours()-signinTime.getHours())*60 + (endTime.getMinutes()-signinTime.getMinutes());
    return result;
  }
  var date = Date.parse(req.body.date);
  var date_Begin = new Date(date);
  var date_End = new Date(date);

  SignIn.findOne({StudentId: req.body.StudentId, BeginSubjectDate: {$lte: date_Begin}, EndSubjectDate: {$gte: new Date(date_End.setMinutes(date_End.getMinutes()+10))}}, function(err, signs){
    if(err){
      next(err);
    } else{
      if(signs){
        if(signs.SecondSignInState == 0){
//          if(CountSignOut(signs.EndSubjectDate,date)<=10){
//            console.log('可以签退');
            signs.SecondSignInState = 1;
            signs.SecondSignInTime = date_Begin;
            signs.save();
            res.send('签退成功');
//          } else{
//            res.send('现在不是签退时间');
//          }
        } else{
          res.send('你已经签退了');
        }
      } else{
        res.send('现在不需要签退');
      }
    }
  });
});

// 查看是否有课
router.get('/CheackIfSign', function(req,res,next){
  var date = Date.parse(req.query.date);
  date = new Date(date);
  SignIn.findOne({StudentId: req.query.StudentId, BeginSubjectDate: {$lte: date}, EndSubjectDate: {$gte: date}}, function(err, signs){
    if(err){
      next(err);
    } else{
      if(signs){
        console.log(signs);
        res.json(signs);
      } else{
        res.send('没课');
      }
    }
  });
});




function Ctnot(startTime,endTime,signInTime,signOutTime){
  //
  if(startTime && endTime && signInTime && signOutTime){
    if(((signInTime.getHours()-startTime.getHours())*60 + (signInTime.getMinutes()-startTime.getMinutes())) <= 25){
      c = -1;
      return c;
    } else{
      // a: 应该上课的节数
      var a = ((endTime.getHours()-startTime.getHours())*60 + (endTime.getMinutes()-startTime.getMinutes()))/55;
      // b: 实际上课的节数
      var b = ((signOutTime.getHours()-signInTime.getHours())*60 + (signOutTime.getMinutes()-signInTime.getMinutes()))/55;
      //
      //var c = parseInt(a)-parseInt(b);
      var c = (1-Math.round(b)/parseInt(a))*parseInt(a);
      return c;
    }
  } else if(startTime && endTime && signInTime){
    // a: 应该上课的节数
    var a = ((endTime.getHours()-startTime.getHours())*60 + (endTime.getMinutes()-startTime.getMinutes()))/55;
    // b: 实际上课的节数
    var b = 0;
    //
    //var c = parseInt(a)-parseInt(b);
    var c = parseInt(a);
    return c;
  } else if(startTime && endTime && signOutTime){
    // a: 应该上课的节数
    var a = ((endTime.getHours()-startTime.getHours())*60 + (endTime.getMinutes()-startTime.getMinutes()))/55;
    // b: 实际上课的节数
    var b = 0;
    //
    //var c = parseInt(a)-parseInt(b);
    var c = parseInt(a);
    return c;
  } else{
    // a: 应该上课的节数
    var a = ((endTime.getHours()-startTime.getHours())*60 + (endTime.getMinutes()-startTime.getMinutes()))/55;
    // b: 实际上课的节数
    var b = 0;
    //
    //var c = parseInt(a)-parseInt(b);
    var c = parseInt(a);
    return c;
  }
}

var rule5 = new schedule.RecurrenceRule();

rule5.hour = 23;
rule5.minute = 30;

var j5 = schedule.scheduleJob(rule5, function(){
  //
  var today_Begin = new Date();
  today_Begin.setHours(7,00,00);
  var today_End = new Date();
  today_End.setHours(23,00,00);
  //
  SignIn.find({BeginSubjectDate: {$gte: today_Begin}, EndSubjectDate: {$lte: today_End}, Ctnot: 0}, function(err, signs){
    //
    signs.forEach(function(item){
      item.Ctnot = Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime);
      //console.log(Ctnot(item.BeginSubjectDate, item.EndSubjectDate, item.FirstSignInTime, item.SecondSignInTime));
      item.save();
    })
  });
});



module.exports = router;

//1161,1990

