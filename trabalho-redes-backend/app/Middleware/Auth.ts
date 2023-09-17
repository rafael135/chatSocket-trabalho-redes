import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
	public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL

		let auth = request.header("Authorization")?.split(" ");

		if(auth!.length < 2 || auth![1] == "") {
			response.status(401);
			return response.send({
				user: null,
				status: 401
			});
		}



		return await next()
	}
}
