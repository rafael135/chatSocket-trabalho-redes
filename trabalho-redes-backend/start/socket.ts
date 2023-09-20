import UsersController from 'App/Controllers/Http/UserController';
import Ws from 'App/Services/Ws';
import Drive from "@ioc:Adonis/Core/Drive";
import fs from "fs";
import { AssetsDriverContract } from '@ioc:Adonis/Core/AssetsManager';
import { DriveManager } from '@adonisjs/core/build/standalone';

// Invoco o metodo 
Ws.boot();

// Tipagem do usuario
type User = {
	name: string;
	ip: string;
}

// Array que armazena os usuarios online no chat
let users: User[] = [];

// Coloco o socket para "escutar" a porta 3333, mesma do Adonis
Ws.io.listen(3333);

// Tipagem da mensagem
type MessageType = {
    author: User;
    type: "new-user" | "msg";
    msg: string;
}

Ws.io.on('connection', (socket) => {
	//let activeUsr: User;

	// Armazena id unico do cliente conectado
	let activeIp: string;

	// Monitora o recebimento da mensagem do cliente
	// "join-request" => Pedido para "entrar" no chat
  	socket.on("join-request", (data: { name: string }) => {
		// Crio um objeto representando um usuario com seu nome e gero um id unico usando seu nome com um numero aleatorio de 0 a 10000
		let usr: User = { name: data.name, ip: `${data.name}${Math.floor(Math.random() * 10000)}` };

		// Adiciono o usuario a lista de usuarios conectados ao chat
		users.push(usr);
		// Armazeno seu id unico. Cada client conectado possui seu "proprio" id unico armazenado
		activeIp = usr.ip;

		//console.log(usr);
		//console.log(users);

		// Envio uma mensagem de volta ao client(front-end), enviando a lista de usuarios atual e o usuario conectado
		socket.emit("user-ok", users, usr);

		// Envio para todos os clients conectados ao socket o novo usuario que entrou no chat
		socket.broadcast.emit("new-user", usr);
	});


	// "send-msg" => Monitora se uma nova mensagem esta sendo enviada
	socket.on("send-msg", (msg: MessageType) => {
		// Manda resposta da imagem para todos os nodos conectados
		socket.broadcast.emit("new-msg", msg);

		// Envia resposta de volta para o socket do "client"(Para evitar repetição de código)
		socket.emit("new-msg", msg);
	});

	// Tipagem da imagem
	type ImgType = {
		user: User;
		msg: string;
		imgs: any[];
	}

	// Tipagem da imagem a ser enviada de volta
	type ImgReceiveType = {
		msg: string;
		imgs: string[];
	}

	// "send-img" => Monitora o envio das imagens junto a mensagem
	socket.on("send-img", ({ user, msg, imgs }: ImgType) => {
		// Array para armazenar o codigo das imagens convertidos em BASE64
		let base64Files: string[] = [];

		// Percorre todas as imagens enviadas
		imgs.forEach(img => {
			// @ts-ignore
			let fileBase64 = Buffer.from(img, "base64").toString("base64"); // Transformo a imagem enviada em uma string BASE64

			// Adiciono a string convertida ao array
			base64Files.push(fileBase64);
		});

		// Monto a mensagem a ser enviada de volta
		let newImg: ImgReceiveType = { msg: msg, imgs: base64Files };
		
		// Manda resposta da imagem para todos os nodos conectados, com o autor e a mensagem
		socket.broadcast.emit("new-img", user, newImg);

		// Envio de volta ao client(Para evitar repetição de código)
		socket.emit("new-img", user, newImg);
	});


	// "disconnect" => Monitora se o socket esta offline(client desconectou, fechou conexão, etc...)
	socket.on("disconnect", (disc, desc) => {
		//console.log(users);

		// Obtenho o usuario a ser removido do array de usuarios ativos
		let userLeft = users.filter((usr) => {
			if(usr.ip == activeIp) {
				return usr;
			}
		})[0];
		
		// Filtro os usuarios e removo o usuario offline
		users = users.filter((usr) => {
			if(usr.ip != activeIp) {
				return usr;
			}
		});

		//console.log(users);

		// Envio a nova lista de usuarios para todos conectados
		socket.broadcast.emit("renew-users", users);

		// Envio o usuario desconectado do chat
		socket.broadcast.emit("left-user", userLeft);
	});

	
});


