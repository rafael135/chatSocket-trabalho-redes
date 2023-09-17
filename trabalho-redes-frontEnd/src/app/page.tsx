"use client"

import Chat from '@/components/Chat';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { UserProvider } from '@/contexts/UserContext';
import Image from 'next/image'

export default function Home() {
	return (
		<main className="w-full h-screen flex flex-col p-8">
			<UserProvider>
				<MessagesProvider>
					<Chat />
				</MessagesProvider>
			</UserProvider>
		</main>
	);
}
