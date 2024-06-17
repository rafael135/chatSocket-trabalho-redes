import request from "supertest";
import server from "../../src/index";
import JWT from "jsonwebtoken";
import { mariaDb as sequelize } from "../../src/Instances/MariaDB";
import { User } from "../../src/Models/User";
import { UserRelation } from "../../src/Models/UserRelation";
import { hash } from "bcrypt";
import TokenService from "../../src/Services/TokenService";

const req = request(server.app);
const tokenService = server.appContainer.resolve("tokenService") as TokenService

describe('1 - User Routes', () => {
    let user1Uuid: string | null = null;
    let user2Uuid: string | null = null;

    let user1Token: string | null = null;
    let user2Token: string | null = null;


    afterAll(async () => {
        await User.destroy({
            where: {},
            truncate: true
        });

        await UserRelation.destroy({
            where: {},
            truncate: true
        });
    });

    beforeAll(async () => {
        let name1 = `TestUser${Math.random() * 99999}`;
        let name2 = `TestUser${Math.random() * 99999}`;

        let user1 = await User.create({
            name: name1,
            nickName: `${name1}#${Math.random() * 99999}`,
            email: `${name1}@gmail.com`,
            password: await hash("00000000", 10)
        });

        let user2 = await User.create({
            name: name2,
            nickName: `${name2}#${Math.random() * 99999}`,
            email: `${name2}@gmail.com`,
            password: await hash("00000000", 10)
        });

        user1Uuid = user1.uuid;
        user2Uuid = user2.uuid;

        user1Token = tokenService.encodeToken(user1)!;
        user2Token = tokenService.encodeToken(user2)!;
    });

    test("1 - Register Route", async () => {

        const payload = {
            name: "TestUser",
            email: "test@gmail.com",
            password: "0000",
            confirmPassword: "0000"
        };

        const res = await req.post("/register")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
    });

    test("2 - Login Route", async () => {
        
        const payload = {
            email: "test@gmail.com",
            password: "0000"
        }

        const res = await req.post("/login")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(200);
    });


    test("3 - Invalid Register Form", async () => {
        const payload = {};

        const res = await req.post("/register")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(400);
    });


    test("4 - Invalid Login Form", async () => {
        const payload = {};

        const res = await req.post("/register")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(400);
    });

    test("5 - Login Wrong password", async () => {
        const payload = {
            email: "test@gmail.com",
            password: "232143141"
        }

        const res = await req.post("/login")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set("Accept", "application/json");

        expect(res.status).toBe(401);
    });

    test("6 - User Friends", async () => {
        let testUser = await User.findOne({
            where: {
                email: "test@gmail.com"
            }
        });

        if(testUser == null) {
            return fail("Usuário de teste não existente");
        }

        let testToken = JWT.sign(
            { uuid: testUser.uuid, name: testUser.name, email: testUser.email },
            process.env.JWT_KEY as string,
            { expiresIn: "30 days" }
        );

        let user1 = await User.create({
            name: "TestUser2",
            nickName: "TestUser2#1111",
            email: "test2@gmail.com",
            password: "0000"
        });

        let user2 = await User.create({
            name: "TestUser3",
            nickName: "TestUser3#2222",
            email: "test3@gmail.com",
            password: "0000"
        });

        let relation1 = await UserRelation.create({
            fromUserUuid: user1.uuid,
            toUserUuid: testUser.uuid
        });

        let relation2 = await UserRelation.create({
            fromUserUuid: testUser.uuid,
            toUserUuid: user1.uuid
        });

        const res = await req.get(`/user/${testUser.uuid}/friends`)
            .set("Cookie", `auth_session=${testToken}`)
            .set("Accept", "application/json");

        if(res.body.userFriends != null &&
            res.body.status == 200) 
        {
            expect(true).toBe(true);
        } else {
            expect(false).toBe(true);
        }
    });


    test("7 - Send friend solicitation", async () => {

        const payload = {
            userUuid: user2Uuid
        };
        
        let res = await req.post("/user/addFriend")
            .send(payload)
            .set("Cookie", `auth_session=${user1Token}`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

       
        expect(res.status).toBe(200);
    });

    
    test("8 - Confirm friend solicitation", async () => {
        const payload = {
            userUuid: user2Uuid
        };

        let res = await req.post("/user/addFriend")
            .send(payload)
            .set("Cookie", `auth_session=${user2Token}`)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        expect(res.status).toBe(201);
    });
});