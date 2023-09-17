import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ws from 'App/Services/Ws';

export default class UsersController {

    public async login({ request, response }: HttpContextContract) {
        let name: string | null = request.input("name", null);

        if(name == null) {
            response.status(400);
            return response.send({
                user: null,
                status: 400
            });
        } 

        


    }

}
