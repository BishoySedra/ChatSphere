import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { configureEnvironmentVariable } from "./src/helpers/enviroment.js";
import errorHandler from "./src/middlewares/errors/errorHandler.js";
import notFoundHandler from "./src/middlewares/errors/notFoundHandler.js";
import authRoutes from "./src/routes/auth.js";
import profileRoutes from "./src/routes/profile.js";
import friendRoutes from "./src/routes/friend.js";
import chatRoutes from "./src/routes/chat.js";
import messageRoutes from './src/routes/message.js';
import connectDB from "./src/db/connection.js";
import fileUpload from "./src/helpers/multer.js";


import http from "http";
import { socketConnection } from "./src/helpers/sockets.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = new Express();


const allowedOrigins = [process.env.CLIENT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)

app.use(Express.json());
app.use(fileUpload.single("imageMessage"));

// routes
app.use(`${process.env.BASE_URL}/profile`, profileRoutes);
app.use(`${process.env.BASE_URL}/auth`, authRoutes);
app.use(`${process.env.BASE_URL}/users`, friendRoutes);
app.use(`${process.env.BASE_URL}/chats`, chatRoutes);
app.use(`${process.env.BASE_URL}/messages`, messageRoutes);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);


const server = http.createServer(app);
try {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    let env = configureEnvironmentVariable();
    connectDB(env);
    console.log(`Server listening on port ${port}`);
  });
  
} catch (error) {
  console.log(error);
}

socketConnection(server)

export default app;
