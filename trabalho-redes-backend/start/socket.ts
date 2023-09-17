import UsersController from 'App/Controllers/Http/UserController';
import Ws from 'App/Services/Ws';
import Drive from "@ioc:Adonis/Core/Drive";
import fs from "fs";
import { AssetsDriverContract } from '@ioc:Adonis/Core/AssetsManager';
import { DriveManager } from '@adonisjs/core/build/standalone';
Ws.boot()

/**
 * Listen for incoming socket connections
 */

type User = {
	name: string;
	ip: string;
}

const usrCtrl = new UsersController();


let users: User[] = [];

Ws.io.listen(3333);

type MessageType = {
    author: User;
    type: "new-user" | "msg";
    msg: string;
}

Ws.io.on('connection', (socket) => {
	//let activeUsr: User;
	let activeIp: string;

  	socket.on("join-request", (data: { name: string }) => {
		let usr: User = { name: data.name, ip: `${data.name}${Math.floor(Math.random() * 10000)}` };

		users.push(usr);
		activeIp = usr.ip;

		//console.log(usr);
		//console.log(users);

		socket.emit("user-ok", users, usr);
		socket.broadcast.emit("new-user", usr);

		//activeUsr = usr;
	});

	socket.on("send-msg", (msg: MessageType) => {
		// Manda resposta da imagem para todos os nodos conectados
		socket.broadcast.emit("new-msg", msg);

		// Envia resposta de volta para o socket
		socket.emit("new-msg", msg);
	});

	type ImgType = {
		user: User;
		msg: string;
		imgs: any[];
	}

	type ImgReceiveType = {
		msg: string;
		imgs: string[];
	}

	socket.on("send-img", ({ user, msg, imgs }: ImgType) => {
		let base64Files: string[] = [];

		imgs.forEach(img => {
			// @ts-ignore
			let fileBase64 = Buffer.from(img, "base64").toString("base64");
			//console.log(fileBase64);

			base64Files.push(fileBase64);
		});

		let newImg: ImgReceiveType = { msg: msg, imgs: base64Files };
		
		// Manda resposta da imagem para todos os nodos conectados
		socket.broadcast.emit("new-img", user, newImg);

		// Envia resposta de volta para o socket
		socket.emit("new-img", user, newImg);
	});

	socket.on("disconnect", (disc, desc) => {
		console.log(users);

		let userLeft = users.filter((usr) => {
			if(usr.ip == activeIp) {
				return usr;
			}
		})[0];
		
		users = users.filter((usr) => {
			if(usr.ip != activeIp) {
				return usr;
			}
		});

		console.log(users);

		socket.broadcast.emit("renew-users", users);
		socket.broadcast.emit("left-user", userLeft);
	});

	
});


