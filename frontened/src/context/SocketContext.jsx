// SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const {currentUser}=useContext(AuthContext)
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${window.location.origin}`);
    setSocket(newSocket);

    // Clean up socket connection on unmount
    return () => newSocket.close();
  }, []);

  useEffect(()=>{
    currentUser && socket?.emit("newUser",currentUser.id)
  },[currentUser,socket])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
