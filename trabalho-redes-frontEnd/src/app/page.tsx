"use client"

import Chat from '@/components/pages/Chat';
//import Image from 'next/image'

export default function Home() {
	return (
		<main className="w-full h-screen flex flex-col p-8">
			<Chat />
		</main>
	);
}
