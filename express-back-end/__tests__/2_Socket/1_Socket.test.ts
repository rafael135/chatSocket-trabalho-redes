import { Socket, io } from "socket.io-client";
import request from "supertest";
import dotenv from "dotenv";
import app from "../../src";
import { User } from "../../src/Models/User";
import { hash } from "bcrypt";
import AuthService from "../../src/Services/AuthService";
import { MessageType, onUserGroupMsgType, onUserPrivateMsgType } from "../../src/Services/WebSocket";
import { Group } from "../../src/Models/Group";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV?.replace(' ', '')}`) });

const req = request(app);

describe("3 - Socket", () => {

    let userToken: string | null = "";
    let user2Token: string | null = "";
    let socket: Socket | null;

    let testGroupUuid: string = "";

    beforeAll(async () => {
        let randomName = `Test${Math.random() * 999999}`;

        let user = await User.create({
            name: randomName,
            nickName: `${randomName}#${Math.random() * 9999}`,
            email: `${randomName}@gmail.com`,
            password: `${await hash("00000000", 10)}`
        });

        userToken = AuthService.encodeToken(user);

        randomName = `Test${Math.random() * 999999}`;

        let user2 = await User.create({
            name: randomName,
            nickName: `${randomName}#${Math.random() * 9999}`,
            email: `${randomName}@gmail.com`,
            password: `${await hash("00000000", 10)}`
        });

        user2Token = AuthService.encodeToken(user2);

        socket = io(`localhost:${process.env.PORT as string}/chat`, {
            auth: {
                token: `Bearer ${userToken ?? ""}`
            },
            extraHeaders: {
                Cookie: `auth_session=${userToken};`
            },
            withCredentials: true,
            autoConnect: false,
            reconnectionAttempts: 5
        });

        let group = await Group.create({
            name: `TestGroup${Math.random() * 9999}`
        });

        testGroupUuid = group.uuid;
    });

    test("1 - Socket connection", () => {
        socket!.emit("test-connection");

        socket!.on("connection-established", ({ connected }: { connected: boolean }) => {
            expect(connected).toBe(true);
        });
    });

    test("2 - Message to user with socket", () => {
        const expectedMsg: MessageType = {
            type: "msg",
            msg: "TestMessage",
            to: "user",
            toUuid: user2Token!
        };


        const msg: onUserPrivateMsgType = {
            userUuid: user2Token!,
            msg: "TestMessage",
            type: "msg",
            imgs: []
        };

        socket!.emit("user_private_msg", msg);

        socket!.on("new_private_msg", (receivedMsg: MessageType) => {
            expect((receivedMsg.msg == expectedMsg.msg && receivedMsg.to == expectedMsg.to &&
                receivedMsg.toUuid == expectedMsg.toUuid && receivedMsg.type == expectedMsg.type)
            ).toBe(true);
        });
    }, 8000);

    test("3 - Message to group with socket", () => {
        const expectedMsg: MessageType = {
            type: "msg",
            msg: "TestMessage",
            to: "group",
            toUuid: testGroupUuid!
        };

        const msg: onUserGroupMsgType = {
            groupUuid: user2Token!,
            msg: "TestMessage",
            type: "msg",
            imgs: []
        };

        socket!.emit("user_group_msg", msg);

        socket!.on("new_group_msg", (receivedMsg: MessageType) => {
            expect((receivedMsg.msg == expectedMsg.msg && receivedMsg.to == expectedMsg.to &&
                receivedMsg.type == expectedMsg.type)
            ).toBe(true);
        });
    }, 8000);


    /* test("4 - ", () => {

    }); */

});