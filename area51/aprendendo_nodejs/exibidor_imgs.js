var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('imagem.jpg', function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/webp'});
    res.write(data);
    return res.end();
  });
}).listen(3000);
