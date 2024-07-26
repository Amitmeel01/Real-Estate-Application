const {Server} = require('socket.io')

const io=new Server({
    cors:{
        origin:"http://localhost:5173"
    }
}) 

let onlineUser=[]

const adduser=(userId,socketId)=>{
    const userExist=onlineUser.find(user=>user.userId===userId);
    if(!userExist){
        onlineUser.push({userId,socketId});   
    }
}

const removeUser=(socketId)=>{
    onlineUser=onlineUser.filter((user)=>user.socketId!==socketId)
}

const getuser=(userId)=>{
    return onlineUser.find((user)=>user.userId===userId)
}

io.on("connection",(socket)=>{
    socket.on("newUser",(userId)=>{
       
       adduser(userId,socket.id)
    })

    socket.on("sendMessage",({receiverId,data})=>{
        const receiver=getuser(receiverId)
        io.to(receiver.socketId).emit("getMessage",data)
    })

    socket.on("disconnect",()=>{
removeUser(socket.id)
    })
})

io.listen(4000)