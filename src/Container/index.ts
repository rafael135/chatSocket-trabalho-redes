import { AwilixContainer, BuildResolver, DisposableResolver, asClass, createContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import TokenService from "../Services/TokenService";
import AuthService from "../Services/AuthService";
import FriendService from "../Services/FriendService";
import UserService from "../Services/UserService";
import MessageImageService from "../Services/MessageImageService";
import MessageService from "../Services/MessageService";
import GroupService from "../Services/GroupService";


/*
interface CustomContainer extends AwilixContainer {
    tokenService: BuildResolver<TokenService> & DisposableResolver<TokenService>;

}
*/


export const loadContainer = (server: Application) => {
    const Container = createContainer({
        injectionMode: "CLASSIC"
    });

    Container.register({
        tokenService: asClass(TokenService).scoped(),
        authService: asClass(AuthService).scoped(),
        friendService: asClass(FriendService).scoped(),
        groupService: asClass(GroupService).scoped(),
        userService: asClass(UserService).scoped(),
        messageImageService: asClass(MessageImageService).scoped(),
        messageService: asClass(MessageService).scoped()
    });

    server.use(scopePerRequest(Container));

    return Container;
}