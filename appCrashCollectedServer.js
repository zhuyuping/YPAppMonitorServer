// appCrashCollectedServer.js
var express = require('express');
var app = express();
var mysql  = require('mysql');  
var url = require('url');
var util = require('util');
var multer  = require('multer')
var fs = require('fs');
var util = require('util');

var connection = mysql.createConnection({     
                                        host     : 'localhost',
                                        user     : 'root',
                                        password : 'anjubao',
                                        port: '3306',
                                        database: 'appCrashs',
                                        });

connection.connect(function(error){
                   if (error) {
                   console.error('error connecting: ' + error.stack);
                   }
                   else {
                   console.error('mysql connected OK ');
                   }
                   });

//  POST 请求
//  接收数据的格式 {"data":[{"type":2,"identifier":"123345","content":"123"},{"type":2,"identifier":"123","content":"123"}]}
app.post('/YPAppMonitor/crashs', function (request, response) {
         var body = "";
         request.on('data', function (chunk) {
                    body += chunk;
                    });
         
         request.on('end', function () {
                    
                    if (!body) {
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createErrorJsonSting(_Error_Invalid_parameter));
                    console.error("post crashs error !");
                    return;
                    }
                    
                    body = JSON.parse(body);
                    /// 参数异常
                    if (!body.data ) {
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createErrorJsonSting(_Error_Invalid_parameter));
                    console.error("post crashs error !");
                    return;
                    }
                    
                    var reports = body.data;
                    var params = [];
                    var length = 0;
                    reports.forEach(function(report,i,a){
                                    var arr = [];
                                    arr[0] = report.identifier;
                                    arr[1] = report.content;
                                    arr[2] = report.type;
                                    params[i] = arr;
                                    length ++;
                                    });
                    
                    /// 成功
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createSuccessJsonSting(""));
                    console.info("post crashs success .");
                    
                    if (length == 0) { return; }
                    
                    var  addSql = 'INSERT INTO appCrashs(identifier,content,type) VALUES ?';
                    
                    console.log('add : ' + params );
                    // 增
                    connection.query(addSql,[params],function (err, result) {
                                     if(err){
                                     console.log('[INSERT ERROR] - ',err.message);
                                     return;
                                     }
                                     
                                     console.log('--------------------------INSERT----------------------------');
                                     console.error('INSERT Content:',params);
                                     console.log('-----------------------------------------------------------------\n\n');
                                     });
                    
                    });
         })

//  POST 请求
//  接收数据的格式 {"data":[{"type":2,"identifier":"123345","content":"123"},{"type":2,"identifier":"123","content":"123"}]}
app.post('/YPAppMonitor/fluencies', function (request, response) {
         
         var body = "";
         request.on('data', function (chunk) {
                    body += chunk;
                    });
         
         request.on('end', function () {
                    
                    if (!body) {
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createErrorJsonSting(_Error_Invalid_parameter));
                    console.error("post fluencies error !");
                    return;
                    }
                    
                    body = JSON.parse(body);
                    /// 参数异常
                    if (!body.data ) {
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createErrorJsonSting(_Error_Invalid_parameter));
                    console.error("post fluencies error !");
                    return;
                    }
                    
                    var reports = body.data;
                    var params = [];
                    var length = 0;
                    reports.forEach(function(report,i,a){
                                    var arr = [];
                                    arr[0] = report.identifier;
                                    arr[1] = report.content;
                                    arr[2] = report.type;
                                    params[i] = arr;
                                    length ++;
                                    });
                    
                    /// 成功
                    response.writeHead(200,{"Content-Type":"application/json"});
                    response.end(createSuccessJsonSting(""));
                    console.info("post fluencies success .");
                    
                    if (length == 0) { return; }
                    
                    var  addSql = 'INSERT INTO appFluencies(identifier,content,type) VALUES ?';
                    
                    console.log('add : ' + params );
                    // 增
                    connection.query(addSql,[params],function (err, result) {
                                     if(err){
                                     console.log('[INSERT ERROR] - ',err.message);
                                     return;
                                     }
                                     
                                     console.log('--------------------------INSERT----------------------------');
                                     console.error('INSERT Content:',params);
                                     console.log('-----------------------------------------------------------------\n\n');
                                     });
                    
                    });
         })


/* 图片上传 */
// shotimage 目录在当前执行node命令的相对路径下
var storage = multer.diskStorage({
                                 destination: 'shotimage/',
                                 filename: function (req, file, cb) {
                                 cb(null, file.originalname);
                                 }
                                 });
var upload = multer({
                    storage: storage
                    });
app.use('/shotimage', express.static('shotimage'));
app.post('/YPAppMonitor/shot', upload.array('image',30), function(req, res, next){
         if (!req.files) {
         response.writeHead(200,{"Content-Type":"application/json"});
         response.end(createErrorJsonSting(_Error_Invalid_parameter));
         console.error("post shot error !");
         return
         }
         console.log(req.files)
         res.writeHead(200,{"Content-Type":"application/json"});
         res.end(createSuccessJsonSting(""));
         });


/* 控制台日志上传 */
// log 目录在当前执行node命令的相对路径下
var storage_log = multer.diskStorage({
                                     destination: 'log/',
                                     filename: function (req, file, cb) {
                                        cb(null, file.originalname);
                                     }
                                 });
var upload_log = multer({
                        storage: storage_log
                    });
app.use('/log', express.static('log'));
app.post('/YPAppMonitor/log', upload_log.array('log',30), function(req, res, next){
         console.log('/YPAppMonitor/log');
         if (!req.files) {
            response.writeHead(200,{"Content-Type":"application/json"});
            response.end(createErrorJsonSting(_Error_Invalid_parameter));
            console.error("post log error !");
            return
         }
            console.log(req.files)
            res.writeHead(200,{"Content-Type":"application/json"});
            res.end(createSuccessJsonSting(""));
         });

//  GET 请求
app.get('/YPAppMonitor/crashs', function (request, response) {
        var params = url.parse(request.url,true).query;
        
        if (!params.page || !params.length || params.page < 1) {
        response.writeHead(200,{"Content-Type":"application/json"});
        response.end(createErrorJsonSting(_Error_Invalid_parameter));
        console.error("post crashs error !");
        return;
        }
        
        // 查 总数
        var sqlString = 'select count(*) from appCrashs';
        console.info(sqlString);
        connection.query(sqlString,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
                         
            console.log('--------------------------select count(*) from appCrashs----------------------------');
            var totalItem = result[0]['count(*)'];
            console.info('count:',totalItem);
            console.log('-----------------------------------------------------------------\n\n');
                         
            // 查 具体页
            var allPage = parseInt(totalItem)/params.length;
            var pageStr = allPage.toString();
            // 不能被整除
            if (pageStr.indexOf('.')>0) {
                allPage = parseInt(pageStr.split('.')[0]) + 1;
            }
            
            var start,length;
            length = params.length;
            if (length <= totalItem) {
                length = params.length;
                start = totalItem - (params.page)*params.length
                if (start < 0) {
                    console.log('sta:' + start);
                    var v = parseInt(start) + parseInt(params.length);
                    if (v > 0) {
                         length = v;
                         start = 0;
                         console.log('1.这里长度=='+length);
                    }
                    else {
                         start = 0;
                         length = 0;
                         console.log('2.这里');
                    }
                }
            }
            else {
                length = totalItem;
                start = 0;
                console.log('3.这里长度=='+length);
            }
                         
            var  sqlString = 'select * from appCrashs limit '+ start + ',' + length;
            // 查
            console.info(sqlString);
            connection.query(sqlString,function (err, list) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                                          
                console.log('--------------------------SELECT----------------------------');
                console.error('SELECT Content:',result);
                console.log('-----------------------------------------------------------------\n\n');
                                          
                var data = {
                    "totalItem" : totalItem,
                    "totalPage" : allPage,
                    "currentPage" : params.page,
                    "list" : list
                };
                                          
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(createSuccessJsonSting(data));
                console.info("get fluencies success .");
            });
                         
            });
})

//  GET 请求
app.get('/YPAppMonitor/fluencies', function (request, response) {
        var params = url.parse(request.url,true).query;
        
        if (!params.page || !params.length || params.page < 1) {
        response.writeHead(200,{"Content-Type":"application/json"});
        response.end(createErrorJsonSting(_Error_Invalid_parameter));
        console.error("post fluencies error !");
        return;
        }
        
        // 查 总数
        var sqlString = 'select count(*) from appFluencies';
        console.info(sqlString);
        connection.query(sqlString,function (err, result) {
                         if(err){
                         console.log('[INSERT ERROR] - ',err.message);
                         return;
                         }
                         
                         console.log('--------------------------select count(*) from appFluencies----------------------------');
                         var totalItem = result[0]['count(*)'];
                         console.info('count:',totalItem);
                         console.log('-----------------------------------------------------------------\n\n');
                         
                         // 查 具体页
                         var allPage = parseInt(totalItem)/params.length;
                         var pageStr = allPage.toString();
                         // 不能被整除
                         if (pageStr.indexOf('.')>0) {
                         allPage = parseInt(pageStr.split('.')[0]) + 1;
                         }
                         
                         var start,length;
                         length = params.length;
                         if (length <= totalItem) {
                         length = params.length;
                         start = totalItem - (params.page)*params.length
                         if (start < 0) {
                         console.log('sta:' + start);
                         var v = parseInt(start) + parseInt(params.length);
                         if (v > 0) {
                         length = v;
                         start = 0;
                         console.log('1.这里长度=='+length);
                         }
                         else {
                         start = 0;
                         length = 0;
                         console.log('2.这里');
                         }
                         }
                         }
                         else {
                         length = totalItem;
                         start = 0;
                         console.log('3.这里长度=='+length);
                         }
                         
                         
                         sqlString = 'select * from appFluencies limit ' + start + ',' + length ;
                         console.info(sqlString);
                         connection.query(sqlString,function (err, list) {
                                          if(err){
                                          console.log('[INSERT ERROR] - ',err.message);
                                          return;
                                          }
                                          
                                          console.log('--------------------------SELECT----------------------------');
                                          console.info('SELECT Content:',list);
                                          console.log('-----------------------------------------------------------------\n\n');
                                          
                                          var data = {
                                          "totalItem" : totalItem,
                                          "totalPage" : allPage,
                                          "currentPage" : params.page,
                                          "list" : list
                                          };
                                          
                                          response.writeHead(200, {'Content-Type': 'text/plain'});
                                          response.end(createSuccessJsonSting(data));
                                          console.info("get fluencies success .");
                                          });
                         });
        
        
        })

var server = app.listen(8088,function(){
                        // var host = server.address().address
                        var port = server.address().port;
                        console.log('server is running on port : ' + port );
                        });


// methods
const _Error_Invalid_parameter = 10001;

function createErrorJsonSting(code) {
    var failed_resp = {
        "success" : false,
        "code" : code,
        "data" : "",
        "msg" : errorMsg(code)
    };
    var string = JSON.stringify(failed_resp);
    return string;
}

function createSuccessJsonSting(data) {
    var failed_resp = {
        "success" : true,
        "code" : 10000,
        "data" : data,
        "msg" : "成功"
    };
    var string = JSON.stringify(failed_resp);
    return string;
}

function errorMsg(code) {
    if (code == _Error_Invalid_parameter) return "参数异常";
    return "未知错误";
}




