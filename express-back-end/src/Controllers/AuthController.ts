import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import argon from "argon2";
import { User, UserInstance } from "../Models/User";

type decodedToken = {
    uuId: string;
    name: string;
    email: string;
}

type inputErrorType = {
    target: string;
    msg: string;
}

const sessionPassword = process.env.JWT_KEY as string;

export const decodeToken = (token: string): decodedToken | null => {
    let user: decodedToken | null = null;

    try {
        user = JWT.verify(
            token,
            process.env.JWT_KEY as string
        ) as decodedToken;
    }
    catch(err) {
        console.error(err);
    }

    return user;
}

export const genRamdomRoom = async (user: UserInstance) => {
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

    //console.log(name, email, password, confirmPassword);

    if(name == null || email == null || password == null || confirmPassword == null) {
        res.status(400);
        return res.send({
            target: "all",
            msg: "Um ou mais campos não preenchidos!",
            status: 400
        });
    }

    if(password != confirmPassword) {
        res.status(400);
        return res.send({
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
        return res.send({
            target: "email",
            msg: "E-mail já utilizado!",
            status: 400
        });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword
    });

    //newUser.privateRoom = await genRamdomRoom(newUser);

    let token = "";

    try {
        token = JWT.sign(
            { uuId: newUser.uuId, name: newUser.name, email: newUser.email },
            process.env.JWT_KEY as string,
            { expiresIn: "7 days" }
        );
    }
    catch(err) {
        console.error(err);

        res.status(500);
        return res.send({
            status: 500
        });
    }

    await newUser.save();
    
    res.status(201);
    return res.send({
        user: {
            uuId: newUser.uuId,
            email: newUser.email,
            name: newUser.name,
            avatarSrc: newUser.avatarSrc,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        },
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

    let existentUser = await User.findOne({
        where: {
            email: email
        }
    });

    if(existentUser == null) {
        res.status(401);
        return res.send({
            errors: [
                {
                    target: "all",
                    msg: "E-mail e/ou senha incorreta!"
                }
            ]
        });
    }

    let verifyPassword = await bcrypt.compare(password, existentUser.password!);

    if(verifyPassword == false) {
        res.status(401);
        return res.send({
            errors: [
                {
                    target: "all",
                    msg: "E-mail e/ou senha incorreta!"
                }
            ]
        });
    }

    let token = "";

    try {
        token = JWT.sign(
            { uuId: existentUser.uuId, name: existentUser.name, email: existentUser.email },
            process.env.JWT_KEY as string,
            { expiresIn: "7 days" }
        );
    }
    catch(err) {
        console.error(err);

        res.status(500);
        return res.send({
            status: 500
        });
    }
    
    res.status(200);
    return res.send({
        user: {
            uuId: existentUser.uuId,
            email: existentUser.email,
            name: existentUser.name,
            avatarSrc: existentUser.avatarSrc,
            createdAt: existentUser.createdAt,
            updatedAt: existentUser.updatedAt
        },
        token: token,
        status: 200
    });
}


export const checkToken = async (req: Request, res: Response) => {
    let token = req.cookies.auth_session as string | null;

    if(token == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let valid = false;

    try {
        JWT.verify(token, process.env.JWT_KEY as string);

        valid = true;
    }
    catch(err) {
        console.error(err);
    }
    
    if(valid == true) {
        res.status(200);

        return res.send({
            status: 200
        });
    }

    res.status(401);
    return res.send({
        status: 401
    });
    
}