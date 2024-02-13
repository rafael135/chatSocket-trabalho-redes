import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { hash, compare } from "bcrypt";
import { User, UserInstance } from "../Models/User";

type decodedToken = {
    id: number;
    name: string;
    email: string;
}

export const decodeToken = (token: string): decodedToken | null => {
    let user: decodedToken | null = null;

    try {
        user = JWT.verify(
            token,
            process.env.JWT_KEY as string
        ) as decodedToken;
    }
    catch(err) {

    }

    return user;
}

export const genRamdonRoom = async (user: UserInstance) => {
    let isUnique = false;
    let roomKey = "";

    while(isUnique == false) {
        roomKey = Buffer.from(
            `${user.name}${Math.random() * Number.MAX_VALUE}`)
        .toString("base64");

        let isUsed = await User.findOne({
            where: {
                privateRoom: roomKey
            }
        });

        if(isUsed == null) {
            isUnique = true;
        }
    }

    return roomKey;
}

export const register = async (req: Request, res: Response) => {
    let { name, email, password, confirmPassword } = req.body as { name: string | null, email: string | null, password: string | null, confirmPassword: string | null };

    if(name == null || email == null || password == null || confirmPassword == null) {
        res.status(400);
        return res.json({
            target: "all",
            msg: "Um ou mais campos não preenchidos!",
            status: 400
        });
    }

    if(password != confirmPassword) {
        res.status(400);
        return res.json({
            target: "confirmPassword",
            msg: "Senhas diferentes!",
            status: 400
        });
    }

    let existentEmail = await User.findOne({
        where: {
            email: email
        }
    });

    if(existentEmail != null) {
        res.status(400);
        return res.json({
            target: "email",
            msg: "E-mail já utilizado!",
            status: 400
        });
    }

    let hashedPassword = await hash(password, 10);

    let newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    });

    newUser.privateRoom = await genRamdonRoom(newUser);

    let token = JWT.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email },
        process.env.JWT_KEY as string,
        { expiresIn: "7 days" }
    );

    newUser.password = "";

    res.status(201);
    return res.json({
        user: newUser,
        token: token,
        status: 201
    });
}

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body as { email: string | null, password: string | null };

    if(email == null || password == null) {
        res.status(400);
        return res.json({
            target: "all",
            msg: "E-mail e/ou senha incorreta!",
            status: 400
        });
    }

    


}