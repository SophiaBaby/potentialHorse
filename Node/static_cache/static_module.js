var BASE_DIR = __dirname,
    CONF = BASE_DIR + '/conf/',
    STATIC = BASE_DIR + '/static',
    mmieConf;
var CATCH_TIME = 60*60*24*365;

var fs = require('fs'),
    sys = require('util'),
    http = require('http'),
    url = require('url'),
    path = require('path');
mmieConf = getUrlConf();



//获取MMIE配置信息，读取配置文件
function getUrlConf() {
    var routerMsg = {};
    try {
        var str = fs.readFileSync(CONF + 'mmie_type.json','utf8');
        console.log(str)
        routerMsg = JSON.parse(str);
    }catch (e){
        sys.debug("JSON parse failed")
    }
    return routerMsg;
}

/*
* 相应静态资源请求
* @param string pathnamr
* @param object res
* @return null
*/

exports.getStaticFile = function (pathname, res) {
    var extname = path.extname(pathname);
    extname = extname ? extname.slice(1) : '';
    var realPath = STATIC + pathname;
    var mmieType = mmieConf[extname] ? mmieConf[extname] : 'text/plain';

    fs.exists( realPath, function (exists) {
        if(!exists){
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('this request' + pathname + 'was not found');
            res.end();
        }else {
            var fileInfo = fs.statSync(realPath);
            var lastModified = fileInfo.mtime.toUTCString();
            if(mmieConf[extname]){
                var expires = new Date();
                expires.setTime(expires.getDate() + CATCH_TIME * 1000);
                res.setHeader("Expires",expires.toUTCString());
                res.setHeader("Cathe-Control","max-age=" + CATCH_TIME);
            }
            if(req.headers['if-modified-since'] && lastModified ==req.headers['if-modified-since']){
                res.writeHead(304, "Not modified");
                res.end();
                }else {
                fs.readFile(realPath, 'binary', function (err, file) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    } else {
                        res.setHeader("Last-Modified",lastModified);
                        res.writeHead(200, {'Content': mmieType});
                        res.write(file, 'binary');
                        res.end();
                    }
                })
            }
        }
    })
}

//判断文件是否存在

