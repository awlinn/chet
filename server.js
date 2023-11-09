
const http = require('http');

const path = require('path');
const fs = require('fs');

let db = require("./database")

const mysql = require('mysql2');

const indexHtmlFile = fs.readFileSync(path.join(__dirname,"static","chat","index.html"));
const scriptJsFile = fs.readFileSync(path.join(__dirname,"static","chat","script.js"));
const styleScriptFile = fs.readFileSync(path.join(__dirname,"static","chat","style.css"));

const regHtmlFile = fs.readFileSync( path.join(__dirname,"static","regChat","reg.html"));
const regJsFile = fs.readFileSync(path.join(__dirname,"static","regChat","regJs.js"));
const regCssFile = fs.readFileSync(path.join(__dirname,"static","regChat","regCss.css"));




const server = http.createServer((request, response)=> {
    if(request.method === "GET"){
        switch(request.url){
            case "/": return  response.end(regHtmlFile);
            case '/regJs.js': return response.end(regJsFile);
            case "/regCss.css": return response.end(regCssFile);
            case "/index.html": return response.end(indexHtmlFile);
            case "/script.js": return  response.end(scriptJsFile);
            case "/style.css": return response.end(styleScriptFile);
        }
    }else if(request.method === "POST"){
        switch(request.url){
            case "/api/register": return registerUser(request, response)
        }
    }
        response.statusCode = 404;
        return response.end('Error 404');
});

server.listen(5050);


function registerUser(request, response){

    let data = "";
    request.on("data", function(chunk) {
        data += chunk;
    });
    request.on('end', function() {
        console.log(data);
        return response.end();
    });
}

/*
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password :"zaq1@WSX",
    database:"chat",
});
*/

const { Server } = require("socket.io") ;
const io = new Server(server);


let chetHistory;

io.on('connection', async (socket) => {
    
    const message = "Новое сообщение";
    const userId = 1;
    await db.addMessage(message,userId); 
   
/*
    socket.on('new_message', (message) => {
        console.log('New message from the user ' + socket.id + ': ' + message);
        io.emit('message', message);
        
            connection.query(`INSERT INTO message(author_id,dialog_id,content) VALUES ("6", "4","${message}")`,  (err, result) => {
            if (err) {
                console.error('Error while writing to the database: ', err);    
                connection.end(); 
            } else {
                console.log('Message successfully saved to the database. ');
                process.on('exit', () => {
                    connection.end();
                });
            }
        });
    });
*/
    socket.on('changeNickname',(socket) =>{
        let userNickname = socket;
        console.log(userNickname);
    });
    
});



