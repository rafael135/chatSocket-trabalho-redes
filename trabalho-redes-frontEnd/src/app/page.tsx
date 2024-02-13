"use client"

import Chat from '@/components/Chat';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { SocketContextProvider } from '@/contexts/SocketContext';
import { UserProvider } from '@/contexts/UserContext';
import ProtectRoute from '@/helpers/ProtectRoute';
//import Image from 'next/image'

export default function Home() {
	return (
		<main className="w-full h-screen flex flex-col p-8">
			<UserProvider>
				<ProtectRoute>
					<SocketContextProvider>
						<MessagesProvider>
							<Chat />
						</MessagesProvider>
					</SocketContextProvider>
				</ProtectRoute>
			</UserProvider>
		</main>
	);
}
