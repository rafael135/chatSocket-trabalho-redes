import express, { ErrorRequestHandler, Request, Response } from "express";
import { Server } from "http";
import socketIo from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./Routes/index";
import * as AuthController from "./Controllers/AuthController";
import { User, UserInstance } from "./Models/User";
import WebSocket from "./Utils/WebSocket";

dotenv.config();

const app = express();
const server = new Server(app);

app.use(cors({
    origin: "*"
}));

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(async (req: Request, res: Response) => {
    res.status(404);
    res.json({
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
        res.json({
            error: err.message,
        });
    } else {
        res.json({
            error: "Ocorreu um erro!",
            status: 400
        });
    }
}

app.use(errorHandler);

const io = new socketIo.Server(server, {
    cors: {
        origin: "*"
    }
});

const Socket = new WebSocket(io);
Socket.InitializeSocket();


const port = Number.parseInt(process.env.PORT as string) || 7000;
server.listen(port);