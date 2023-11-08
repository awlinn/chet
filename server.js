
const http = require('http');

const path = require('path');
const fs = require('fs');

let db = require("./database")

const mysql = require('mysql2');


const pathToIndex = path.join(__dirname,"static","index.html");
const indexHtmlFile = fs.readFileSync(pathToIndex);

const scriptFile = path.join(__dirname,"static","script.js");
const scriptJsFile = fs.readFileSync(scriptFile);

const cssFile = path.join(__dirname,"static","style.css");
const styleScriptFile = fs.readFileSync(cssFile);

const server = http.createServer((request, response)=> {

    switch(request.url){
        case '/': return response.end(indexHtmlFile);
        case "/script.js": return  response.end(scriptJsFile);
        case "/style.css": return response.end(styleScriptFile);
    }

        response.statusCode = 404;
        return response.end('Error 404');
});

server.listen(5050);


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



