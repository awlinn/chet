const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require("socket.io");
const db = require("./database");

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        console.log(request.url);
        switch (request.url) {
            case "/":
                return response.end(fs.readFileSync(path.join(__dirname, "static", "regChat", "reg.html")));
            case '/regJs.js':
                return response.end(fs.readFileSync(path.join(__dirname, "static", "regChat", "regJs.js")));
            case "/regCss.css":
                return response.end(fs.readFileSync(path.join(__dirname, "static", "regChat", "regCss.css")));
            case "/index.html":
                return response.end(fs.readFileSync(path.join(__dirname, "static", "chat", "index.html")));
            case "/script.js":
                return response.end(fs.readFileSync(path.join(__dirname, "static", "chat", "script.js")));
            case "/style.css":
                return response.end(fs.readFileSync(path.join(__dirname, "static", "chat", "style.css")));
        }
    } else if (request.method === "POST") {
        switch (request.url) {
            case "/api/register":
                return registerUser(request, response);
            case "/api/login":
                return loginUser(request, response);
        }
    }
    response.statusCode = 404;
    return response.end('Error 404');
});

const io = new Server(server);

server.listen(5050);

///registerUser
async function registerUser(request, response) {
    let data = "";
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on('end', async function () {
        try {
            let parsedData = JSON.parse(data);
            let login = parsedData.login;
            let password = parsedData.password;
            let registConfirmPassword = parsedData.registConfirmPassword;

            if (password !== registConfirmPassword) {
                console.log("Password is not equal to Confirm Password");
            } else if (await db.authenticateUserName(login)) {
                console.log("a user with the same name already exists");
            }
            else {
                await db.registerUser(login, password);
                console.log("successful");
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end();
            }
        } catch (e) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Registration failed', message: e.message }));
            console.log("500 lol");
        }
    });
}


async function loginUser(request, response) {
    let data = "";
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on('end', async function () {
        try {
            const { login, password } = JSON.parse(data);
            const dbReportAuthenticated = await db.authenticateUser(login, password);

            if (dbReportAuthenticated.isAuthenticated) {
                response.writeHead(302, { 'Location': '/index.html' });
                response.end();
            } else {
                response.writeHead(401, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Login failed', message: 'Invalid credentials' }));
            }
        } catch (e) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Login failed', message: e.message }));
        }
    });
}


io.on('connection', async (socket) => {
    const message = "New message";
    const userId = 1;
    await db.addMessage(message, userId);

    socket.on('new_message', (message) => {
        console.log('New message from the user ' + socket.id + ': ' + message);
        io.emit('message', message);
        db.addMessage(message, userId);
    });

    socket.on('changeNickname', (socket) => {
        let userNickname = socket;
        console.log(userNickname);
    });
});


