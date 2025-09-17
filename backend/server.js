const express = require('express');
const http = require('http'); // Import the http module
const { Server } = require("socket.io"); // Import the Server class from socket.io
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const initializeSocket = require('./socketHandler'); // Import our new socket logic

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server from our Express app
const io = new Server(server, {
    cors: {
        // Allow connections from your live Netlify PWA
        origin: "https://capable-tartufo-0dc856.netlify.app",
        methods: ["GET", "POST"]
    }
});


app.use(cors());
app.use(express.json());

connectDB();

// Import route files
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

// API Routes
app.get('/', (req, res) => {
    res.send('Khel Saarthi API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Initialize our socket logic
initializeSocket(io);

const PORT = process.env.PORT || 10000;

// Start the server using server.listen() instead of app.listen()
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});