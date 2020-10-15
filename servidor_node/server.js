//const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
//const qrcode = require('fs').readFileSync(__dirname + '/qrcode.min.js', 'utf8');
const fs = require('fs');
const formidable = require('fs');
const multer = require('multer');
//================== CREDENCIAIS DO CERTIFICADO SSL ===============================
/*const privateKey = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
*/
const http = require('http');//.createServer(app);
//const https = require('https');
const express = require('express');
const app = express();

// =====================  =================================
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);
//trocar httpsServer ou httpServer sem s ou com s
const io = require('socket.io')(httpServer);

// ========================= Configura o upload com Multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	//cb significa callback
	//__dirname é necessário para salvar a partir do diretório de trabalho deste arquivo
    cb(null, __dirname + '/static/uploads/' + email_do_usuario_logado + '/');
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname + '_' + Date.now() + '.jpg');
    cb(null, file.originalname);
  }
}); 
//var memoreStorage = multer.memoryStorage()
const upload = multer({ storage: storage });
//const upload = multer({ storage: memoreStorage });
//const upload = multer({ dest: 'static/uploads/' });

var email_do_usuario_logado = "sem-email";

app.use(express.static('public'));

// ============================ ROTAS =============================================

// cria uma rota para fornecer o arquivo index.html
app.get('/upload.html', function(req, res){	
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/upload.html');   
});

// cria uma rota para reveber arquivos enviados (as fotos, no caso)	
app.post('/receber-arquivo', upload.single('file'), function(req, res){		
	res.send("<h2>Upload realizado com sucesso em: destination</h2>" + 
	req.file.destination + "<h2>Upload realizado com sucesso em: originalname</h2>" + 
	req.file.originalname + "<h2>Upload realizado com sucesso em: filename</h2>" + 
	req.file.filename+ " <h2>Upload realizado com sucesso em path: </h2>" + 
	req.file.path);  
	console.log('<h2>Upload realizado com sucesso</h2>');
});

// cria uma rota para fornecer o arquivo qrcode.min.js
app.get('/qrcode.min.js', function(req, res){	
	res.set('Content-Type', 'text/javascript');
	res.sendFile(__dirname + '/static/scripts/qrcode.min.js');   
});

// cria uma rota para fornecer o arquivo imagem
app.get('/static/imagens/doc.jpg', function(req, res){	
	res.sendFile(__dirname + '/static/imagens/doc.jpg');   
});

// cria uma rota para fornecer o arquivo imagem
app.get('/imagem_do_servidor', function(req, res){	
	res.sendFile(__dirname + '/static/uploads/' + email_do_usuario_logado + '.jpg');   
});

// cria uma rota para fornecer o arquivo layout.html
app.get('/', function(req, res){
	//res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/layout.html');  
});
// cria uma rota para fornecer o arquivo imagens
app.get('/static/imagens/favicon.ico', function(req, res){
	res.sendFile(__dirname + '/static/imagens/favicon.ico');  
});
app.get('/static/styles/estilo.css', function(req, res){
	res.set('Content-Type', 'text/css');
	res.sendFile(__dirname + '/static/styles/estilo.css');  
});

app.get('/static/styles/print.css', function(req, res){
	res.set('Content-Type', 'text/css');
	res.sendFile(__dirname + '/static/styles/print.css');  
});
app.get('/static/imagens/logo4.png', function(req, res){
	res.sendFile(__dirname + '/static/imagens/logo4.png');  
});


// ROTAS PARA AS PÁGINAS HTML
app.get('/static/content/home.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/home.html');  
});
app.get('/static/content/terms.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/terms.html');  
});
app.get('/static/content/about.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/about.html');  
});
app.get('/static/content/preview-and-print.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/preview-and-print.html');  
});
app.get('/static/content/privacy.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/privacy.html'); 
});
app.get('/static/content/extras.html', function(req, res){
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/static/content/extras.html'); 
});


//=========== CONEXAO ============================================================
io.on("connection",function(client){
    console.log("cliente com id ", client.id , " se conectou!!");
    //This is handle by current connected client 
    //client.emit('mensagem',{hello:'world'});
    //This is handle by every client
    io.sockets.emit("mensagem",{data:"Esse dado é enviado do servidor pra todos os clientes"});
    //app.saveSession(client.id);

    client.on("disconnect",function(){
        //app.deleteSession(client.id);
        console.log("cliente disconectado: ",client.id);
    });
	
	client.on("mensagem",function(data){
        //app.deleteSession(client.id);
        console.log("client mensagem: ",data);
    });
	
	client.on("mensagem android",function(data){
        //app.deleteSession(client.id);
        console.log("mensagem do cliente android: ", data);
		var socketid = data.browser_id;		
		email_do_usuario_logado = data.email_do_usuario_logado;
		//client.emit('mensagem android', data);
		client.broadcast.to(socketid).emit('mensagem android', data);		
    });

});


httpServer.listen(80, () => {
   console.log('Servidor rodando em: http://192.168.0.107:80');
});
/*httpsServer.listen(443, () => {
   console.log('Servidor rodando em: https://cropdox.com:443');
});
*/
