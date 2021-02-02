//const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
//const qrcode = require('fs').readFileSync(__dirname + '/qrcode.min.js', 'utf8');
const fs = require('fs');
const multer = require('multer');
var crypto = require('crypto');
var md5 = require('md5');
 
//console.log(md5('message'));
//var name = 'braitsch';
//var hash = crypto.createHash('md5').update(name).digest('hex');
//console.log(hash); 
//================== CREDENCIAIS DO CERTIFICADO SSL ===============================
const privateKey = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/cropdox.com/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};




const http = require('http');//.createServer(app);
const https = require('https');
const express = require('express');
const app = express();

// =====================  =================================
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//trocar httpsServer ou httpServer sem s ou com s
const io0 = require('socket.io')(httpServer);
const io = require('socket.io')(httpsServer);

// ========================= Configura o upload com Multer

var email_do_usuario_logado = "default";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
	//cb significa callback
	//__dirname é necessário para salvar a partir do diretório de trabalho deste arquivo
    cb(null, __dirname + '/static/uploads/default/');
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
var path = require('path');
var options = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html', 'css', 'js'],
	index: false,
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
	  res.set('x-timestamp', Date.now())
	}
  }
//app.use(express.static(path.join(__dirname + "static/", 'styles')));
app.use("/static", express.static(path.join(__dirname, 'static'), options));

// ============================ ROTAS =============================================
app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
	console.log('req.headers.host ', req.headers.host);
	if (req.headers.host == "cropdox.com.br") {			
		res.redirect('https://cropdox.com' + req.url);	

	}else if (req.headers.host == "cropdox.com") {
		if (req.secure) {//Se a requisição feita é segura (é HTTPS)		
			next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
		}else{ //Se a requisição não for segura (é HTTP)
			res.redirect('https://' + req.headers.host + req.url);
		}
	}
	
});
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

app.delete('/arquivo/:id/deletar', function(req, res){
    const { id } = req.params;
    fs.unlink(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg', function (err) {            
        if (err) {                                                 
            console.error(err);                                    
        }                                                          
       console.log('File has been Deleted');                           
    });  
 })

 // cria uma rota para fornecer o arquivo de imagem
app.get('/imagem_do_servidor', function(req, res){	
	res.set('Content-Type', 'image/jpeg');
	res.sendFile(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg');   
});
// cria uma rota para fornecer o arquivo de imagem
app.get('/imagem_do_servidor/download', function(req, res){	
	res.download(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg');   
});

// cria uma rota para fornecer o arquivo layout.html
app.get('/', function(req, res){
	//console.log("https://" + req.headers.host + req.url)
	res.set('Content-Type', 'text/html');
	res.sendFile(__dirname + '/layout.html');  
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
    
    client.on("deletar",function(data){
        if(data == "arquivo"){
            fs.unlink(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg', function (err) {            
                if (err) {                                                 
                    console.error(err);                                    
                } else{
                    console.log('File has been Deleted');                           
                }
            });  
        }
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
		//email_do_usuario_logado = email_do_usuario_logado;
		//client.emit('mensagem android', data);
		client.broadcast.to(socketid).emit('mensagem android', data);		
    });

});

httpServer.listen(80, () => {
   console.log('Servidor rodando em: http://cropdox.com:80');
});
httpsServer.listen(443, () => {
   console.log('Servidor rodando em: https://cropdox.com:443');
});


