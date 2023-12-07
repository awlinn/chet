const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require("socket.io");
const db = require("./database");

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
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

function registerUser(request, response) {
    let data = "";
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on('end', async function () {
        try {
            const user = JSON.parse(data);
            await db.registerUser(user);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Registration successful' }));
        } catch (e) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Registration failed', message: e.message }));
        }
    });
}

function loginUser(request, response) {
    let data = "";
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on('end', async function () {
        try {
            const { login, password } = JSON.parse(data);
            const dbReportAuthenticated = await db.authenticateUser(login, password);

            if (dbReportAuthenticated.isAuthenticated) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Login successful' }));
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


async function handleAuthentication(request, response) {
    let data = "";
    request.on("data", function (chunk) {
        data += chunk;
    });

    request.on('end', async function () {
        try {
            const user = JSON.parse(data);
            const token = await db.getAuthToken(user);
            validAuthTokens.push(token);
            response.writeHead(200);
            response.end(token);
        } catch (e) {
            response.writeHead(500);
            return response.end('Error: ' + e.message);
        }
    });
}