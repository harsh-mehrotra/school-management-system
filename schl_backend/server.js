import express from 'express';
import authRoute from './routes/authRoute.js';
import studentRoutes from './routes/studentRoute.js';
import teacherRoutes from './routes/teacherRoute.js';
import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import './scheduler/cronJobs.js';
// import { Server } from 'socket.io';
// import http from 'http';
import dotenv from 'dotenv';
import { corsOptions } from './config/corsOption.js';

dotenv.config(); 

const app = express();
connectDB();

// Middleware
//app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); 



// Socket.IO Setup
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: corsOptions 
// });

// io.on('connection', (socket) => {
//     console.log("A new user has connected", socket.id);
//     socket.on('disconnect', () => {
//         console.log("User disconnected", socket.id);
//     });
// });

// Routes
app.use('/api/auth', authRoute);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.get('/', (req, res) => {
    res.send("Backend is Running 🔥");
});

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log("ERROR:", message);
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

const PORT = process.env.PORT || 3101;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

