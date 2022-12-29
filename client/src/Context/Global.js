import { createContext, useRef, useState } from "react";
import { io } from "socket.io-client";

export const GlobalContext = createContext(null);

export default function AuthContext({ children }) {
  const [loggedUser, setloggedUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chatMembers, setChatMembers] = useState({});
  const socket = useRef();
  socket.current = io("http://localhost:8800");

  return (
    <GlobalContext.Provider
      value={{
        loggedUser,
        setloggedUser,
        connected,
        setConnected,
        chatMembers,
        setChatMembers,
        socket,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
