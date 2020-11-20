module.exports = function(app){
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
        res.sendFile(__dirname + '/static/imagens/fundo_papel.jpg');   
    });
    // cria uma rota para fornecer o arquivo imagem
    app.get('/static/imagens/load.gif', function(req, res){	
        res.sendFile(__dirname + '/static/imagens/load.gif');   
    });
    // cria uma rota para fornecer o arquivo imagem
    app.get('/static/imagens/download-icon.png', function(req, res){	
        res.sendFile(__dirname + '/static/imagens/download-icon.png');   
    });
    // cria uma rota para fornecer o arquivo imagem
    app.get('/static/imagens/print-icon.png', function(req, res){	
        res.sendFile(__dirname + '/static/imagens/print-icon.png');   
    });
    // cria uma rota para fornecer o arquivo de imagem
    app.get('/imagem_do_servidor', function(req, res){	
        res.sendFile(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg');   
    });
    // cria uma rota para fornecer o arquivo de imagem
    app.get('/imagem_do_servidor/download', function(req, res){	
        res.download(__dirname + '/static/uploads/default/' + email_do_usuario_logado + '.jpg');   
    });

    // cria uma rota para fornecer o arquivo layout.html
    app.get('/', function(req, res){
        console.log("https://" + req.headers.host + req.url)
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/layout.html');  
    });
    app.get('/acentos', function(req, res){
        res.set('Content-Type', 'text/html');
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
    app.get('/static/styles/extras.css', function(req, res){
        res.set('Content-Type', 'text/css');
        res.sendFile(__dirname + '/static/styles/extras.css');  
    });

    app.get('/static/styles/print.css', function(req, res){
        res.set('Content-Type', 'text/css');
        res.sendFile(__dirname + '/static/styles/print.css');  
    });
    app.get('/static/imagens/logo.svg', function(req, res){
        res.sendFile(__dirname + '/static/imagens/logo.svg');  
    });


    // ROTAS PARA AS PÁGINAS DE CONTEÚDO HTML
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
    app.get('/static/content/premium.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/premium.html'); 
    });
    app.get('/static/content/calculadora.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/calculadora.html'); 
    });
    app.get('/static/content/acentos.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/acentos.html'); 
    });
    app.get('/static/content/privacy.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/privacy.html'); 
    });
    app.get('/static/content/extras.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/extras.html'); 
    });
    app.get('/static/content/manutencao.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/manutencao.html'); 
    });
    app.get('/static/content/doacao.html', function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendFile(__dirname + '/static/content/doacao.html'); 
    });
}
