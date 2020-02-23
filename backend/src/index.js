const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
const routes = require('./routes.js');
const http = require('http');
const {setupWebsocket} = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://Jonathan:sargitarios123@cluster0-i9rsd.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(cors());
app.use(express.json());
app.use(routes);


//Metodos HTTP: GET, POST, PUT, DELETE

//Tipos de Parametros

//Query Params: request.query (Filtros, ordenação, paginação, ...)

//Route Params:request.params (Identificar um recurso na alteração ou remoção)

//Body: request.body (Dados para criação ou alteração de um registro)



server.listen(3333);