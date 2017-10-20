var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    BASE_DIR = __dirname;
http.createServer(function (req,res) {
    var pathname = url.parse(req.url).pathname;
    var realPath = __dirname + '/static' + pathname;
    if (pathname == '/favicon.icon'){
        return;
    }else if( pathname == '/index' || pathname == '/'){
        goIndex(res);
    }else {
        dealWithStatic(pathname,realPath,res);
    }
}).listen(1337);

console.log('Server running at http://127.0.0.1:1337')


function goIndex(res) {
    var readPath = BASE_DIR + '/' + url.parse('index.html').pathname;
    var indexPage = fs.readFileSync(readPath);
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(indexPage);
}

function dealWithStatic(pathname, realPath, res) {
    console.log(pathname)
    console.log(realPath)
    fs.exists(realPath,function (exists) {
        if (!exists){
            res.writeHead(404, {'Content':'text/plain'});
            res.write('this requst URL ' + pathname + "was not fund");
            res.end();
        }else {
            var pointPosition = pathname.lastIndexOf('.'),
                mmieString = pathname.substring(pointPosition + 1),
                mmieType;
            console.log(mmieString)
            switch (mmieString){
                case 'css': mmieType = 'text/css';
                break;
                case 'png': mmieType = 'image/png';
                break;
                default:
                    mmieType = 'text/plain';
            }
            fs.readFile(realPath, 'binary' , function (err, file) {
                if (err){
                    res.writeHead(500, {'Content-Type':'text/plain'});
                    res.end(err);
                }else {
                    res.writeHead(200, {'Content-Type': mmieType});
                    res.write(file, "binary");
                    res.end();
                }
            })
        }
    })

}
