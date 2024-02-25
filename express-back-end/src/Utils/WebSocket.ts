import { Server, Socket } from "socket.io";
import * as AuthController from "../Controllers/AuthController";
import { User, UserInstance } from "../Models/User";
import { GroupMessage } from "../Models/GroupMessage";

type SocketDataType = {
    user: UserInstance;
};

export type MessageType = {
    author?: UserInstance | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    msg: string;
    imgs?: string[];
    to: "user" | "group";
    toUuId: string;
}

type onUserGroupMsgType = {
    groupUuId: string;
    msg: string;
};

type onUserPrivateMsgType = {
    userUuId: string;
    msg: string;
};

class WebSocket {
    io: Server;
    connectedUsers: number[] = [];

    constructor(server: Server) {
        this.io = server;
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

        let decodedToken = AuthController.decodeToken(token);

        //console.log(decodedToken);

        if(decodedToken == null) {
            return null;
        }

        let user = await User.findOne({ where: { uuId: decodedToken.uuId } });
        
        if(user == null) {
            return null;
        }

        this.connectedUsers.push(user.id!);

        return user;
    }

    private async onUserJoin(socket: Socket, room: string) {
        socket.in(room).emit("user_group_joined", {
            user: (socket.data as SocketDataType).user
        });
    }

    private async onUserGroupMsg(socket: Socket, msgData: onUserGroupMsgType) {
        let fromUser = socket.data.user as UserInstance;

        let newMsg = await GroupMessage.create({
            fromUserUuId: fromUser.uuId,
            toGroupUuId: msgData.groupUuId,
            body: msgData.msg
        });

        //console.log("teste");

        let msg: MessageType = {
            author: fromUser,
            msg: newMsg.body,
            type: "msg",
            to: "group",
            toUuId: newMsg.toGroupUuId
        };


        socket.in(msgData.groupUuId).emit("new_group_msg", msg);
        socket.emit("new_group_msg", msg);
    }

    private async onUserPrivateMsg(socket: Socket, msgData: onUserPrivateMsgType) {
        let fromUser = socket.data.user as UserInstance;

        let msg: MessageType = {
            author: fromUser,
            type: "msg",
            msg: msgData.msg,
            to: "user",
            toUuId: msgData.userUuId
        };

        socket.in(msgData.userUuId).emit("new_private_msg", msg);
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

            //if(user.privateRoom == null) {
            //    user.privateRoom = await AuthController.genRamdomRoom(user);
            //}

            socket.join(user.uuId);
            

            socket.on("user_group_join", (groupUuId: string) => {
                this.onUserJoin(socket, groupUuId);
            });

            
            socket.on("user_group_msg", (userMsg: onUserGroupMsgType) => {
                this.onUserGroupMsg(socket, userMsg);
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
        
        });
    }

    
}

export default WebSocket;