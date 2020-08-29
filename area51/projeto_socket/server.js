const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const qrcode = require('fs').readFileSync(__dirname + '/qrcode.min.js', 'utf8');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// cria uma rota para fornecer o arquivo index.html
app.get('/qrcode.min.js', function(req, res){	
	res.sendFile(__dirname + '/qrcode.min.js');   
});

// cria uma rota para fornecer o arquivo index.html
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');  
});

io.on("connection",function(client){
    console.log("cliente com id ", client.id , " se conectou!!");
    //This is handle by current connected client 
    //client.emit('mensagem',{hello:'world'});
    //This is handle by every client
    io.sockets.emit("mensagem",{data:"Esse dado é enviado do servidor pra todos os clientes"});
    //app.saveSession(client.id);

    client.on("disconnect",function(){
        //app.deleteSession(client.id);
        console.log("client disconnected: ",client.id);
    });
	
	client.on("mensagem",function(data){
        //app.deleteSession(client.id);
        console.log("client mensagem: ",data);
    });
	
	client.on("mensagem android",function(data){
        //app.deleteSession(client.id);
        console.log("mensagem do cliente android: ", data);
		io.sockets.emit("mensagem android",{data:"Esse dado é enviado do servidor pra todos os clientes android"});
    });

});


//client.broadcast.to(socketid).emit('message', 'for your eyes only');

http.listen(8080, () => {
   console.log('Servidor rodando em: http://cropdox.com:8080');
});