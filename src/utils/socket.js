import io from "socket.io-client";

const socket = io("https://blab-chat-app-backend.onrender.com");

export default socket;
