import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";
import { toast } from "sonner";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socketClient = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      withCredentials: true,
      reconnectionAttempts: 1,
    });

    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("Socket Connected", socketClient.id);
    });

    socketClient.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Socket connection error. Please try again.");
    });

    socketClient.on("internal_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Socket connection error. Please try again.");
    });

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
