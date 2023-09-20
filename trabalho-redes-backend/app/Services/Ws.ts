import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

class Ws {
	public io: Server
	private booted = false

	public boot() {
		/**
		 * Ignore multiple calls to the boot method
		 */
		if (this.booted) {
			return
		}

		this.booted = true

		// Inicializo o socket com a instancia do servidor do Adonis
		this.io = new Server(AdonisServer.instance!, {
			cors: { // Configuro o cors do socket para aceitar qualquer comunicação externa
				origin: "*" 
			},
			maxHttpBufferSize: 1e8 // 100 MB -> Tamanho maximo de dados enviados de uma so vez, padrão = 100Kb
		});
	}
}

export default new Ws()
