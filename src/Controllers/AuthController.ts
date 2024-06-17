import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import argon from "argon2";
import { User, UserInstance } from "../Models/User";
import AuthService from "../Services/AuthService";
import TokenService from "../Services/TokenService";
import { POST, route } from "awilix-express";

type decodedToken = {
    uuid: string;
    name: string;
    email: string;
}

type inputErrorType = {
    target: string;
    msg: string;
}

@route("/api")
class AuthController {
    private readonly _tokenService: TokenService;

    constructor(tokenService: TokenService) {
        this._tokenService = tokenService;
    }


    public async checkCookie(cookie: string | null): Promise<UserInstance | false> {
        if (cookie == null) {
            return false;
        }

        let decToken = this._tokenService.decodeToken(cookie);

        if (decToken == null) {
            return false;
        }

        let user = await User.findOne({
            where: {
                uuid: decToken.uuid
            }
        });

        if (user == null) {
            return false;
        }

        return user;
    }

    public static async genRandomNickName(name: string) {
        let nickName = "";

        let nickNameExists = false;

        do {
            nickName = `${name}#${Math.floor(Math.random() * 99999)}`;

            let user = await User.findOne({
                where: {
                    nickName: nickName
                }
            });

            if (user != null) {
                nickNameExists = true;
            } else {
                nickNameExists = false;
            }
        } while (nickNameExists == true);

        return nickName;
    }



    @route("/register")
    @POST()
    public async register(req: Request, res: Response) {
        let { name, email, password, confirmPassword } = req.body as { name: string | null, email: string | null, password: string | null, confirmPassword: string | null };

        //console.log(name, email, password, confirmPassword);

        let errors: inputErrorType[] = [];

        if (name == null || email == null || password == null || confirmPassword == null) {
            res.status(400);
            errors.push({
                target: "all",
                msg: "Um ou mais campos não preenchidos!"
            });
            return res.send({
                errors: errors,
                status: 400
            });
        }

        if (password != confirmPassword) {
            res.status(400);
            errors.push({
                target: "confirmPassword",
                msg: "Senhas diferentes!"
            });
            return res.send({
                errors: errors,
                status: 400
            });
        }

        let existentEmail = await User.findOne({
            where: {
                email: email
            }
        });

        if (existentEmail != null) {
            res.status(400);
            errors.push({
                target: "email",
                msg: "E-mail já utilizado!",
            });
            return res.send({
                errors: errors,
                status: 400
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            nickName: await AuthController.genRandomNickName(name)
        });

        //newUser.privateRoom = await genRamdomRoom(newUser);

        let token = this._tokenService.encodeToken(newUser);

        if(token == null) {
            res.status(500);
            return res.send({
                status: 5000
            });
        }

        //await newUser.save();

        res.status(201);
        return res.send({
            user: {
                uuid: newUser.uuid,
                email: newUser.email,
                name: newUser.name,
                nickName: newUser.nickName,
                avatarSrc: newUser.avatarSrc,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            },
            token: token,
            status: 201
        });
    }

    @route("/login")
    @POST()
    public async login(req: Request, res: Response) {
        let { email, password } = req.body as { email: string | null, password: string | null };

        let errors: inputErrorType[] = [];

        if (email == null || password == null) {
            res.status(400);
            errors.push({
                target: "all",
                msg: "E-mail e/ou senha incorreta!"
            });
            return res.json({
                errors: errors,
                status: 400
            });
        }

        let existentUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existentUser == null) {
            res.status(401);
            errors.push({
                target: "all",
                msg: "E-mail e/ou senha incorreta!"
            });
            return res.send({
                errors: errors,
                status: 401
            });
        }

        let verifyPassword = await bcrypt.compare(password, existentUser.password!);

        if (verifyPassword == false) {
            res.status(401);

            errors.push({
                target: "email",
                msg: "E-mail e/ou senha incorreta!"
            });

            errors.push({
                target: "password",
                msg: "E-mail e/ou senha incorreta!"
            });

            return res.send({
                errors: errors,
                status: 401
            });
        }

        let token = this._tokenService.encodeToken(existentUser);

        if(token == null) {
            res.status(500);
            return res.send({
                status: 500
            });
        }

        res.status(200);
        return res.send({
            user: {
                uuid: existentUser.uuid,
                email: existentUser.email,
                name: existentUser.name,
                nickName: existentUser.nickName,
                avatarSrc: existentUser.avatarSrc,
                createdAt: existentUser.createdAt,
                updatedAt: existentUser.updatedAt
            },
            token: token,
            status: 200
        });
    }

    @route("/checkToken")
    @POST()
    public async checkToken(req: Request, res: Response) {
        let token = req.cookies.auth_session as string | null;

        if (token == null || token == undefined) {
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
        catch (err) {
            console.error(err);
        }

        if (valid == true) {
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
}

export default AuthController;