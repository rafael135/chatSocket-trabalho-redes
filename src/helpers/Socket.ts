"use client"

import { USER_STORAGE_KEY } from "@/contexts/UserContext";
import { io } from "socket.io-client";

let userToken = null;

if(typeof window !== "undefined") {
    userToken = localStorage.getItem(USER_STORAGE_KEY) ?? null;
}

if(userToken == null) { userToken = "INVALID" }

const socket = io("http://localhost:7000/chat", {
    auth: {
        token: `Bearer ${userToken}`
    }
});

export default socket;