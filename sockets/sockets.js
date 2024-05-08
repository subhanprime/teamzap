let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId == userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users?.filter((user) => user?.socketId != socketId);
};

const getUser = (userId) => {
    let user = users.find((user) => user.userId == userId);
    return user;
};


const socketsHandlers = async (socket, io) => {

    socket.on("addUser", (userId) => {
        if (userId) {
            addUser(userId, socket.id);
            let user = getUser(userId);
            socket.emit("getUser", user);
        }
    });

    socket.on('sendMessage', (data) => {
        let user = getUser(data?.targetId);
        io.to(user?.socketId).emit('arrivedMessage', data)
    })

    socket.broadcast.emit('connect1', 'asd');
    socket.on('disconnect', () => {
        removeUser(socket.id)
    });
}

module.exports = socketsHandlers 