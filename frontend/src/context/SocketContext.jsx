import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("https://chat-app-production-h7xi.onrender.com", {
				query: {
					userId: authUser._id, // Ensure this is defined and valid
				},
			});
	
			socket.on("connect", () => {
				console.log("Connected to server with Socket ID:", socket.id);
			});
	
			socket.on("connect_error", (err) => {
				console.error("Socket connection error:", err);
			});
	
			socket.on("getOnlineUsers", (users) => {
				console.log("Online users received:", users);
				setOnlineUsers(users);
			});
	
			setSocket(socket);
	
			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);
	

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

