

export const ironOptions = {
    cookieName: "SOCKET_CHAT_AUTH",
    password: "teste",

    cookieOptions: {
        secure: process.env.NODE_ENV === "production" ? true : false
    }
};