const express =require('express')
const app = express()
const http =require('http')
const socket =require('socket.io')
const mongoose= require('mongoose')

const cors = require('cors')
app.use(cors())

const liveUserModel= require('./liveUserModel')


const server= http.createServer(app)
app.use(express.urlencoded());

app.get('/liveusers',async function(req,res){
    
    let data = await liveUserModel.find()
    
    res.json({status:true,data:data})
})


mongoose.connect("mongodb+srv://tarun21:tarun1616@cluster0.h0l8mir.mongodb.net/chatHistory1",{
    useNewUrlParser:true
})
.then(function(){
    console.log("mongodb connected")
    // here socket will work on this "server" server

    const io = new socket.Server(server, {
        cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        },
    });
    
    io.on('connection',function(socket){
        
    
    
        var name2
        socket.on('message',function(msg){
            // console.log(msg)
            
            socket.broadcast.emit('message',msg)
            var data={}
            data.name=msg.user
            data.message=msg.message
    
            const dateTime = new Date();
            const formattedDate = dateTime.toLocaleDateString('en-IN');
            const formattedTime = dateTime.toLocaleTimeString('en-IN');
            
            data.dateTime=formattedDate +" "+formattedTime
            console.log(data)
            
        })
        socket.on('info',async function(info){
            console.log('new connection....')
            await liveUserModel.create(info)
            name2=info.name
            socket.broadcast.emit('info',info)
    
        })
    
        socket.on('disconnect', async (name) => {
            console.log('Disconnected from Socket.IO server');
            console.log(name2)
           
            await liveUserModel.deleteMany({name:name2})
            // Perform any necessary cleanup or actions here
            socket.broadcast.emit('disName',name2)
    
        });
    
    })
    

})

    



server.listen(4000, function(){
    console.log("server is running ",4000)
})