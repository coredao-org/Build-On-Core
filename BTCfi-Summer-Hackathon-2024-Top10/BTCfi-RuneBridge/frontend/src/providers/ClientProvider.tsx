import React from "react";
import { Client } from "../core/client";

const defaultValue = {
    client: new Client(),
}
export const ClientContext = React.createContext<{ client : Client}>(defaultValue);

export function ClientProvider({ children }) {
    const client = new Client();
    return (
        <ClientContext.Provider value={{client: client}}>
            {children}
        </ClientContext.Provider>
    )
}