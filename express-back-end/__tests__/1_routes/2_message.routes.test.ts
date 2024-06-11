import server from "../../src";
import request from "supertest";
import { mariaDb } from "../../src/Instances/MariaDB";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { Group, GroupInstance } from "../../src/Models/Group";
import { User, UserInstance } from "../../src/Models/User";


const req = request(server.app);

/*
beforeAll(async () => {
    testUser = await User.create({
        name: "TestUser",
        email: "test@gmail.com",
        password: await bcrypt.hash("0000", 10)
    });

    //console.log("dddd");
});

afterAll(async () => {
    await Group.destroy({
        where: {},
        truncate: true
    });

    await User.destroy({
        where: {},
        truncate: true
    });
});
*/

describe("2 - Message Routes", () => {
    beforeAll(async () => {
         
    })

    test("1 - Create New Group", async () => {
        let testUser = await User.create({
            name: `TestUser${Math.random() * Number.MAX_VALUE}`,
            nickName: `TestUser#${Math.random() * Number.MAX_VALUE}`,
            email: `test${Math.random() * Number.MAX_VALUE}@gmail.com`,
            password: "0000"
        });

        const payload = {
            groupName: "Test Group",
            userUuid: `${testUser!.uuid}`
        };

        const res = await req.post("/group")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
    });

    test("2 - Get Group Messages", async () => {
        let testGroup = (await Group.findOne({
            where: {
                name: "Test Group"
            }
        }))!;

        const res = await req.get(`/message/group/${testGroup.uuid}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
    });

    test("3 - Get User Messages", async () => {
        let testUser = await User.create({
            name: `TestUser${Math.random() * Number.MAX_VALUE}`,
            nickName: `TestUser#${Math.random() * Number.MAX_VALUE}`,
            email: `test${Math.random() * Number.MAX_VALUE}@gmail.com`,
            password: "0000"
        });

        let testToken = JWT.sign(
            { uuid: testUser.uuid, name: testUser.name, email: testUser.email },
            process.env.JWT_KEY as string,
            { expiresIn: "30 days" }
        );

        const res = await req.get(`/message/user/${testUser!.uuid}`)
            .set("Cookie", `auth_session=${testToken}`)
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
    });

    
})