import express, { ErrorRequestHandler, Request, Response } from "express";
import { Server } from "http";
import socketIo from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./Routes/index";
import * as AuthController from "./Controllers/AuthController";
import { User, UserInstance } from "./Models/User";
import WebSocket from "./Services/WebSocket";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const server = new Server(app);

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(async (req: Request, res: Response) => {
    res.status(404);
    return res.send({
        error: "Endpoint não encontrado",
        status: 404
    });
});

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
    if(err.status) {
        res.status(err.status);
    } else {
        res.status(400);
    }

    if(err.message) {
        return res.send({
            error: err.message,
            status: 500
        });
    } else {
        return res.send({
            error: "Ocorreu um erro!",
            status: 500
        });
    }
}

app.use(errorHandler);

const io = new socketIo.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true
    }
});

const Socket = new WebSocket(io);
Socket.InitializeSocket();


const port = Number.parseInt(process.env.PORT as string) || 7000;

if(process.env.NODE_ENV != "test") {
    server.listen(port);
}

export default app;