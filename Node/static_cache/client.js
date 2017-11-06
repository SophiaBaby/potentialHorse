var staticModule = require('./static_module');

var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    BASE_DIR = __dirname;

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    if (pathname == './favicon'){
        return;
    }else if (pathname == '/index' || pathname =='/'){
        goIndex(res);
    }else {
        staticModule.getStaticFile(pathname,res)
    }

}).listen(1337);
console.log('server run at http://127.0.0.1:1337')

function goIndex(res) {
    var readPath = BASE_DIR + '/' + url.parse('index.html').pathname;
    var indexPage = fs.readFileSync(readPath);
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(indexPage);
}