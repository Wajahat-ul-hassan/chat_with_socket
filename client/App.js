import React, { useEffect } from "react";

//👇🏻 app screens
import Login from "./src/screens/Login";
import Messaging from "./src/screens/Messaging";
import Chat from "./src/screens/Chat";

//👇🏻 React Navigation configurations
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import socketServcies from './src/utils/socket'
import SocketIOClient from "socket.io-client/dist/socket.io.js";
import { io } from "socket.io-client";
const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        // socketServcies.initializeSocket()
    }, [])
    const ENDPOINT = "http://localhost:8000";

    const socket = io(ENDPOINT, {
        transports: ['websocket', 'polling'],
        jsonp: false,
     });

    // socket.on("connect_error", (e) => {
    //     console.log(e);
    // }); 
    socket.on("connect", () => {
        console.log("connected");
        socket.emit("hello", "world");
      });
      
      socket.on("connect_error", (err) => {
          console.log("🚀 ~ file: App.js:38 ~ socket.on ~ err:", err)
        console.log(err instanceof Error);
        console.log(err.message); 
      });
    // useEffect(() => {
    //     const socket = SocketIOClient("https://localhost:3000", {
    //         jsonp: false,
    //     });
    //     socket.on("connect", () => {
    //         console.log("connected");
    //         socket.emit("hello", "world");
    //     });

    //     socket.on("connect_error", (err) => {
    //         console.log(err instanceof Error);
    //         console.log(err.message);
    //     });
    // }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name='Chat'
                    component={Chat}
                    options={{
                        title: "Chats",
                        headerShown: false,
                    }}
                />
                <Stack.Screen name='Messaging' component={Messaging} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}