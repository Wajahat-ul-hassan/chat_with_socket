import { io } from "socket.io-client";
const socket = io.connect("http://172.16.0.10:8000");
export default socket;