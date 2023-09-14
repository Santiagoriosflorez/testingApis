module.exports= io =>{

    io.on('connection',(socket)=>{
            console.log('New user Connected');

            socket.on('userCoordinates' , coords =>{
                    socket.broadcast.emit('newUserCoordinates', coords);
                    console.log(coords)
                })

            })
    
    }