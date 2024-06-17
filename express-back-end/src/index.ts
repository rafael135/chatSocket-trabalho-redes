import "reflect-metadata";
import express, { ErrorRequestHandler, Request, Response } from "express";
import { Server } from "http";
import socketIo from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./Routes/index";
import WebSocket from "./Services/WebSocket";
import compression from "compression";
import cookieParser from "cookie-parser";
import { loadControllers } from "awilix-express";
import { loadContainer } from "./Container";
import TokenService from "./Services/TokenService";
import AuthService from "./Services/AuthService";
import MessageService from "./Services/MessageService";
import path from "path";
import https from "https";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV?.replaceAll(' ', '')}`) });

const app = express();
const server = new Server(app);

app.use(cors({
    origin: "*"
}));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let appContainer = loadContainer(app);

if(process.env.NODE_ENV?.replaceAll(' ', '') == "test" || process.env.NODE_ENV?.replaceAll(' ', '') == "development") {
    app.use(loadControllers("Controllers/*.ts", { cwd: __dirname }));
} else {
    app.use(loadControllers("Controllers/*.js", { cwd: __dirname }));
}

//OUTDATED:
//app.use(routes);

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
        console.error(err.message);
        return res.send({
            error: err.message,
            status: 500
        });
    } else {
        console.log("Erro!");
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


let tokenService = appContainer.resolve("tokenService") as TokenService;
let authService = appContainer.resolve("authService") as AuthService;
let messageService = appContainer.resolve("messageService") as MessageService;

const Socket = new WebSocket(io, tokenService, authService, messageService);
Socket.InitializeSocket();


const port = Number.parseInt(process.env.PORT as string) || 7000;

/*
const httpsServer = https.createServer({
    ca: "",
    key: "",
    cert: ""
}, app);
*/

if(process.env.NODE_ENV != "test") {
    server.listen(port);
    //httpsServer.listen(port);
    console.log(`Server running on localhost:${port}`);
}

export default { app, appContainer };