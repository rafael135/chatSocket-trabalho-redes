import request from "supertest";
import app from "../../src/index";
import JWT from "jsonwebtoken";
import { mariaDb as sequelize } from "../../src/Instances/MariaDB";
import { User } from "../../src/Models/User";
import { UserRelation } from "../../src/Models/UserRelations";

const req = request(app);

describe('1 - User Routes', () => {
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
            email: "test2@gmail.com",
            password: "0000"
        });

        let user2 = await User.create({
            name: "TestUser3",
            email: "test3@gmail.com",
            password: "0000"
        });

        let relation1 = await UserRelation.create({
            fromUserUuId: user1.uuid,
            toUserUuId: testUser.uuid
        });

        let relation2 = await UserRelation.create({
            fromUserUuId: testUser.uuid,
            toUserUuId: user1.uuid
        });

        const res = await req.get(`/user/friends/${testUser.uuid}`)
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
});