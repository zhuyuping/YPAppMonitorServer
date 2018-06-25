// appCrashCollectedServer.js
var express = require('express');
var app = express();
var mysql  = require('mysql');  

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
		console.error('mysql connected success ');
	}
});


var success_resp = {
	"success" : true,
	"code" : 0,
	"msg" : "success"
};
var success_resp_json_str = JSON.stringify(success_resp);

var failed_resp = {
	"success" : false,
	"code" : 10001,
	"msg" : "arg error"
};
var failed_resp_json_str = JSON.stringify(failed_resp);

//  POST 请求
app.post('/addRecorder', function (request, response) {

	var body = "";
	request.on('data', function (chunk) {
		body += chunk;
	});

	request.on('end', function () {
		body = JSON.parse(body); 
		/// 参数异常
		if (!body.data ) {
			response.writeHead(200,{"Content-Type":"application/json"});
			response.end(failed_resp_json_str);
			console.error("addRecorder error !");
			return;
		}

		/// 成功
		response.writeHead(200,{"Content-Type":"application/json"});
		response.end(success_resp_json_str);
		console.info(" addRecorder success .");

		var  Params = [];
		var  addSql = 'INSERT INTO appCrashs(Id,identifier,content,type) VALUES(0,?,?,?)';
		for (var i = 0; i < 10; i++) {
			var  param = ["body.identifier", "body.content", 1];
			Params[i] = param;
		}
		
		// 增
		var  param2 = ["sidentifier", "scontent", "1"];
		connection.query(addSql,param2,function (err, result) {
			if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
			}        

			console.log('--------------------------INSERT----------------------------');
       		//console.log('INSERT ID:',result.insertId);        
       		console.log('INSERT ID:',result);        
       		console.log('-----------------------------------------------------------------\n\n');  
   		});
   		
	});	
})

var server = app.listen(8088,function(){
	// var host = server.address().address
	var port = server.address().port;
	console.log('server is running on port : ' + port );

});

