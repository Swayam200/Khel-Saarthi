const Message = require('./models/messageModel');

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('subscribeToNotifications', (eventIds) => {
            eventIds.forEach(eventId => {
                socket.join(eventId);
                console.log(`User ${socket.id} subscribed to notifications for room ${eventId}`);
            });
        });

        socket.on('joinRoom', (eventId) => {
            socket.join(eventId);
            console.log(`User ${socket.id} joined room ${eventId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { eventId, message, user } = data;

            try {
                const newMessage = new Message({
                    text: message,
                    user: { _id: user._id, name: user.name },
                    event: eventId,
                });

                const savedMessage = await newMessage.save();

                io.to(eventId).emit('receiveMessage', savedMessage);

                // Send a notification to everyone else in the room
                socket.to(eventId).emit('notification', {
                    title: `New Message in Event Chat`,
                    message: `${user.name}: ${message}`
                });

            } catch (error) {
                // We will log the error to the console now for easier debugging
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = initializeSocket;