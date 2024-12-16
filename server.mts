import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);


const app = next({dev,hostname,port});
const handle = app.getRequestHandler();

app.prepare().then(()=>{

    const httpServer = createServer(handle);
    const io = new Server(httpServer);

    io.on("connection",(socket) =>{
        console.log(`a user connected : ${socket.id}`);

        socket.on("join-room",({room,username}) =>{
            socket.join(room);
            console.log(`User ${username} joined room ${room}`);
            socket.to(room).emit("user_joined",`${username} joined the room`);
        })

        socket.on("disconnect",() =>{
            console.log(`a user disconnected : ${socket.id}`);
        });
    
    });

    
    httpServer.listen(port,() =>{
        console.log(`Server is running on http://${hostname}:${port}`);
    })
})