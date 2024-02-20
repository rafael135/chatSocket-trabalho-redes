import { Server, Socket } from "socket.io";
import * as AuthController from "../Controllers/AuthController";
import { User, UserInstance } from "../Models/User";

type SocketDataType = {
    user: UserInstance;
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

    private async onUserGroupMsg(socket: Socket, room: string, msg: string) {
        socket.in(room).emit("room_msg", {
            user: (socket.data as SocketDataType).user,
            roomKey: room,
            msg: msg
        });
    }

    private async onUserPrivateMsg(socket: Socket, room: string, msg: string) {
        socket.in(room).emit("private_msg", {
            user: (socket.data as SocketDataType).user,
            roomKey: room,
            msg: msg
        });
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
            
            socket.on("user_group_join", (room: string) => {
                this.onUserJoin(socket, room);
            });
        
            socket.on("user_group_msg", (room: string, msg: string) => {
                this.onUserGroupMsg(socket, room, msg);
            });

            socket.on("user_private_msg", (privateRoom: string, msg: string) => {
                this.onUserPrivateMsg(socket, privateRoom, msg);
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