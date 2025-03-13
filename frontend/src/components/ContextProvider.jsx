import React from 'react'
import { useState } from 'react'
export const Context = React.createContext();

export function MyProvider({ children }) {
    const [user, setUser] = useState({ user : null, isLoggedIn: false });
  
    return (
      <Context.Provider value={{ user, setUser }}>
        {children}
      </Context.Provider>
    );
}