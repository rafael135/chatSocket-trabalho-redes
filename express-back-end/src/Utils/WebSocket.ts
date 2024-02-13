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

    private emitErrorToClient(socket: Socket, type: string, msg: string) {
        socket.emit(type, {
            error: msg
        });
    }

    private async onConnect(socket: Socket): Promise<UserInstance | null> {
        let authorization = socket.handshake.headers.authorization;

        if(authorization == null) { return null; }

        let token = authorization.split(' ')[1];

        if(token == null) { return null; }

        let decodedToken = AuthController.decodeToken(token);

        if(decodedToken == null) {
            return null;
        }

        let user = await User.findOne({ where: { id: decodedToken.id } });
        
        if(user == null) {
            return null;
        }

        this.connectedUsers.push(user.id);

        return user;
    }

    private async onUserJoin(socket: Socket, room: string) {
        socket.in(room).emit("user_joined", {
            user: (socket.data as SocketDataType).user
        });
    }

    private async onUserRoomMsg(socket: Socket, room: string, msg: string) {
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
                console.log(socket.handshake.address);

                this.emitErrorToClient(socket, "connection_error", "Usuário inválido!");
                socket._cleanup();
                socket.disconnect();
                return;
            }
            user.password = "";

            socket.data.user = user;

            if(user.privateRoom == null) {
                user.privateRoom = await AuthController.genRamdonRoom(user);
            }

            socket.join(user.privateRoom);
            
            socket.on("user_join", (room: string) => {
                this.onUserJoin(socket, room);
            });
        
            socket.on("user_room_msg", (room: string, msg: string) => {
                this.onUserRoomMsg(socket, room, msg);
            });

            socket.on("user_private_msg", (privateRoom: string, msg: string) => {
                this.onUserPrivateMsg(socket, privateRoom, msg);
            });
        
            socket.on("disconnect", () => {
                let id = (socket.data.user as SocketDataType).user.id;

                this.connectedUsers.filter(usrId => usrId != id);
                
                socket.data.user = undefined;
                socket._cleanup();
                socket.disconnect();
            });
        
        });
    }

    
}

export default WebSocket;