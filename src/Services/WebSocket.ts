import { Server, Socket } from "socket.io";
import { User, UserInstance } from "../Models/User";

import MessageService from "./MessageService";
import AuthService from "./AuthService";
import TokenService from "./TokenService";
import sequelize, { SequelizeScopeError } from "sequelize";

type SocketDataType = {
    user: UserInstance;
};

export type MessageImageType = {
    authorUuid: string;
    path: string;
};

export type MessageType = {
    author?: UserInstance | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    msg: string;
    imgs?: MessageImageType[];
    to: "user" | "group";
    toUuid: string;
    time?: string;
}

export type onUserGroupMsgType = {
    groupUuid: string;
    msg: string;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    imgs: MessageImageType[];
};

export type onUserPrivateMsgType = {
    userUuid: string;
    msg: string;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    imgs: MessageImageType[];
};

class WebSocket {
    private readonly _tokenService: TokenService;
    private readonly _authService: AuthService;
    private readonly _messageService: MessageService;
    

    io: Server;
    connectedUsers: number[] = [];

    constructor(server: Server, tokenService: TokenService, authService: AuthService, messageService: MessageService) {
        this.io = server;
        this._tokenService = tokenService;
        this._authService = authService;
        this._messageService = messageService;
    }

    private async emitErrorToClient(socket: Socket, type: string, msg: string) {
        socket.emit(type, {
            error: msg
        });
    }

    private async onConnect(socket: Socket): Promise<UserInstance | null> {
        let rawCookies = socket.handshake.headers.cookie?.split('; ') ?? [];

        let authId = rawCookies.findIndex(cookie => cookie.includes("auth_session"));

        if(authId == -1) { return null; }

        //console.log(socket.handshake.headers.cookie);

        let token = rawCookies[authId].split('=')[1];

        if(token == null || token == ";") { return null; }

        let decodedToken = this._tokenService.decodeToken(token);

        //console.log(decodedToken);

        let user: UserInstance | null = null;

        if(decodedToken == null) {
            return null;
        }
        try {
            user = await User.findOne({ where: { uuid: decodedToken.uuid } });
        }
        catch(err: any) {
            if(err.original.AggregateError != null && err.original.AggregateError.errors != null) {
                for(let i = 0; i < err.AggregateError.errors.length; i++) {
                    console.log(err.AggregateError.errors[i])
                }
            }
            console.log(err.original);
        }
        
        
        if(user == null) {
            return null;
        }

        this.connectedUsers.push(user.id!);

        user.password = undefined;

        return user;
    }

    private async onUserJoin(socket: Socket, groupUuid: string) {
        socket.join(groupUuid);

        socket.in(groupUuid).emit("user_group_joined", {
            user: (socket.data as SocketDataType).user
        });
    }

    private async onUserGroupMsg(socket: Socket, msgData: onUserGroupMsgType) {
        let fromUser = socket.data.user as UserInstance;

        let newMsg = await this._messageService.saveGroupMessage(fromUser, msgData);

        if(newMsg == null) { return; }

        let msg: MessageType = {
            author: fromUser,
            msg: newMsg.body,
            imgs: newMsg.imgs,
            type: newMsg.type,
            to: "group",
            toUuid: newMsg.toGroupUuid,
            time: newMsg.createdAt
        };

        socket.in(msgData.groupUuid).emit("new_group_msg", msg);
        socket.emit("new_group_msg", msg);
    }

    private async onUserGroupLeave(socket: Socket, groupUuid: string) {
        let user = (socket.data.user as SocketDataType).user;

        socket.in(groupUuid).emit("user_group_leave", user);

        await socket.leave(groupUuid);
    }

    private async onUserPrivateMsg(socket: Socket, msgData: onUserPrivateMsgType) {
        let fromUser = socket.data.user as UserInstance;

        let newMsg = await this._messageService.savePrivateUserMessage(fromUser, msgData);

        if(newMsg == null) { return; }

        let msg: MessageType = {
            author: fromUser,
            type: newMsg.type,
            imgs: msgData.imgs,
            msg: msgData.msg,
            to: "user",
            toUuid: msgData.userUuid,
            time: newMsg.createdAt
        };

        socket.in(msgData.userUuid).emit("new_private_msg", msg);
        socket.emit("new_private_msg", msg);
    }
    
    public async InitializeSocket() {
        this.io.on("connection", async (socket) => {
            let user = await this.onConnect(socket);
            
            if(user == null) {
                //console.log(socket.handshake.address);

                await this.emitErrorToClient(socket, "connection_error", "Usuário inválido!");
                socket._cleanup();
                socket.disconnect();
                return;
            }
            user.password = undefined;

            socket.data.user = user;

            // "Room" privada do usuario
            socket.join(user.uuid);
            

            socket.on("user_group_join", (groupUuid: string) => {
                this.onUserJoin(socket, groupUuid);
            });

            
            socket.on("user_group_msg", (userMsg: onUserGroupMsgType) => {
                this.onUserGroupMsg(socket, userMsg);
            });

            socket.on("user_group_leave", (groupUuid: string) => {
                this.onUserGroupLeave(socket, groupUuid);
            });

            socket.on("user_private_msg", (userMsg: onUserPrivateMsgType) => {
                this.onUserPrivateMsg(socket, userMsg);
            });
        
            socket.on("disconnect", () => {
                if(socket.data.user == undefined || socket.data.user.id == undefined) { return; }

                let id = (socket.data as SocketDataType).user.id!;

                this.connectedUsers.filter(usrId => usrId != id);
                
                socket.data.user = undefined;
                socket._cleanup();
                socket.disconnect();
            });

            socket.on("test-connection", () => {
                socket.emit("connection-established", { connected: true });
            });
        
        });
    }

    
}

export default WebSocket;