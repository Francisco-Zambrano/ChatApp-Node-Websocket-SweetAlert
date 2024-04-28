import express from 'express';
import path from 'path';
import __dirname from './utils.js';
import {engine} from 'express-handlebars';
import { Server } from "socket.io";
import {router as viewsRouter} from './routes/views.router.js';

const PORT=3000;
const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.use('/', viewsRouter)

let usuarios=[]
let mensajes=[]

const server=app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server)

io.on("connection", socket=>{
    console.log(`A client with id has connected ${socket.id}`)

    socket.on("id", name=>{
        usuarios.push({id:socket.id, name})
        socket.emit("mensajesPrevios", mensajes)
        socket.broadcast.emit("nuevoUsuario", name)
    })

    socket.on("mensaje", (name, mensaje)=>{
        mensajes.push({name, mensaje})
        io.emit("nuevoMensaje", name, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("saleUsuario", usuario.name)
        }
    })
})