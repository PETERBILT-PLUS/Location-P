import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

interface ISocket {
    socket: Socket | null;
}

export const Context = createContext<ISocket | undefined>(undefined);

export const useSocketContext = () => {
    return useContext(Context);
};

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const agency = useSelector((state: any) => state.auth.agency.currentAgency);
    const user = useSelector((state: any) => state.auth.user.currentUser);
    const SERVER: string = import.meta.env.VITE_SERVER as string;
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (agency || user) {
            const newSocket = io(SERVER, {
                query: {
                    user_id: agency ? agency._id : user._id,
                }
            });
            setSocket(newSocket);

            return () => {
                newSocket.close();
                setSocket(null);
            }
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }

    }, [agency, user]);

    return (
        <Context.Provider value={{ socket }}>{children}</Context.Provider>
    );
};

export default SocketContextProvider;